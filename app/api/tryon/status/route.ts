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

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const taskId = url.searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        const apiUrl = 'https://api.klingai.com/v1/images/kolors-virtual-try-on';
        const accessKeyId = process.env.KLING_ACCESS_KEY_ID;
        const accessKeySecret = process.env.KLING_ACCESS_KEY_SECRET;

        if (!accessKeyId || !accessKeySecret) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const token = generateJwtToken(accessKeyId, accessKeySecret);

        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error checking try-on status:', error);
        return NextResponse.json(
            { error: `Status check failed: ${error.message}` },
            { status: 500 }
        );
    }
}
