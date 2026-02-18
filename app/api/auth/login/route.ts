import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'


export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await db.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            return NextResponse.json({ error: "Email não cadastrado!" }, { status: 401 })
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || `${process.env.JWT_AUTHKEY}`,
            { expiresIn: "1d" }
        )

        return NextResponse.json({
            success: true,
            token: token,
            user: { name: user.name, email: user.email }
        })
    } catch (error) {
        console.error("Erro no login:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

}