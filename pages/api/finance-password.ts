import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    
    const { password } = req.body;

    try {
        const passwordFinance = await prisma.user.findFirst({
            where: {
                passwordFinance: password,
            }
        });

        // console.log(passwordFinance?.passwordFinance);

        const resultPassword = await verifyPassword(password, passwordFinance?.passwordFinance);
        // console.log(resultPassword);

        //O resultPassword está passando como FALSE, porque?
            //Está retornando FALSE porque a senha que está no banco de dados NÃO É UM HASH BCRYPT //

        // console.log(resultPassword);

        // if(!resultPassword) {
        //     console.log("Problema com a verificação da senha");
        //     return 
        // }

        return res.status(200).json(resultPassword);
        //Verifique se é pra ser passado como json a response. 

    } catch (error) {
        console.log(error);
        return res.status(500).end(error)
    }

}