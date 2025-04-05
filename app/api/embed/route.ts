import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function GET() {
    const filePath = resolve('./public/embed.js');
    const fileContent = readFileSync(filePath, 'utf8');

    const response = new NextResponse(fileContent, {
        status: 200,
        headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
        },
    });

    return response;
}
