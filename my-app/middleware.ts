import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export const config = {
    matcher : [
        '/((?!kirjaudu|rekisteroidy|_next|.well-known).*)'
    ]
}

export async function middleware(req: NextRequest) {

    return await updateSession(req);


}