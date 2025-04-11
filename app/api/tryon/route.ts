import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// JWT token utility functions
const base64UrlEncode = (text: string): string => {
    return Buffer.from(text)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const generateJwtToken = (
    accessKeyId: string,
    accessKeySecret: string
): string => {
    const headers = { alg: 'HS256', typ: 'JWT' };
    const headers_encoded = base64UrlEncode(JSON.stringify(headers));

    const issuedAt = Math.floor(Date.now() / 1000);
    const payload = {
        exp: issuedAt + 30,
        iss: accessKeyId,
        nbf: issuedAt - 5,
    };
    const payload_encoded = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
    .createHmac('sha256', accessKeySecret)
    .update(`${headers_encoded}.${payload_encoded}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

    return `${headers_encoded}.${payload_encoded}.${signature}`;
};

export async function POST(request: NextRequest) {
    try {
        const { humanImage, clothImage } = await request.json();

        if (!humanImage || !clothImage) {
            return NextResponse.json(
                { error: 'Both human image and cloth image are required' },
                { status: 400 }
            );
        }

        const apiUrl = process.env.KLING_API_URL!;
        const accessKeyId = process.env.KLING_ACCESS_KEY_ID;
        const accessKeySecret = process.env.KLING_ACCESS_KEY_SECRET;

        if (!accessKeyId || !accessKeySecret) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const token = generateJwtToken(accessKeyId, accessKeySecret);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                human_image: humanImage,
                cloth_image: clothImage
            })
        });

        const result = await response.json();

        if (!result || result.code !== 0) {
            return NextResponse.json(
                { error: `API error: ${result?.code || 'Unknown error'}`, details: result },
                { status: 500 }
            );
        }

        return NextResponse.json({ taskId: result.data.task_id });
    } catch (error: any) {
        console.error('Error processing try-on request:', error);
        return NextResponse.json(
            { error: `Request failed: ${error.message}` },
            { status: 500 }
        );
    }
}
