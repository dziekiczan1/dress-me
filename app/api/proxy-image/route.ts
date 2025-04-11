import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse(JSON.stringify({ error: 'URL parameter is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse(JSON.stringify({
                error: `Failed to fetch image: ${response.status} ${response.statusText}`
            }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const contentType = response.headers.get('content-type');
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to proxy image' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// Optionally add CORS headers
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
