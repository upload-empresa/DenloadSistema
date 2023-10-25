import Login from '../pages/home/login';

import { fireEvent, getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { mocked } from 'ts-jest/utils'
import { useForm } from 'react-hook-form'
import { rest } from 'msw';


describe('Teste para o Front-end do Login', () => {
  it('Deve testar se os inputs e o botão estão corretos', () => {
    render(<Login csrfToken={null} redirectAfterSignIn={''} />)
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole('button', {
      name: /Entrar/i
    })

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    userEvent.type(emailInput, "teste@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitButton);

    expect(emailInput).toBeValid();
    expect(passwordInput).toBeValid();
  })
});

describe('Teste para o Back-end do Login (Utilizando Mock)', () => {
  it('Deve dar o submit no botao e verificar se os dados estão corretos', async () => {
    render(<Login csrfToken={null} redirectAfterSignIn={''} />)
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button");

    userEvent.type(emailInput, "email@example.com");
    userEvent.type(passwordInput, "password");
    userEvent.click(submitButton);

    //Deve pegar os dados da api do mock, utilizar o userEvent para simular as interações
    // afirmar se o status HTTP deu como 200, ou seja, o login foi bem efetuado.
  })
  it('Deve verificar se a mensagem de erro aparace após colocar dados errados no botão', async () => {
    //Terei que colocar os dados errados e utilizar o userEvent para clicar no botao e preencher os dados
    //Terei que utilizar o findBy (ou o getByText com o wait) para aguardar o resultado da promisse.
    // Utilizar o waitFor para auxiliar o findBy e aguardar a resposta, mesmo que demore.
    //Verificar se a mensagem avisando que o email e a senha estão incorretos apareceu na tela.
  })
});
