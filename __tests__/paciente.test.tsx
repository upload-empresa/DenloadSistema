import {
    deletePaciente,
    updatePaciente,
    createPaciente
} from "../lib/api/paciente";

import { fireEvent, getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrismaClient } from "@prisma/client";


const prismaClient = new PrismaClient();

describe('CRUD de Pacientes', () => {
    it('Deve criar um novo paciente', async() => {
        

    });

    it('Deve editar um paciente', async() => {

    });

    it('Deve deletar um paciente', async() => {

    })
})