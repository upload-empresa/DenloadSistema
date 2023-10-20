import { Login } from '../pages/home/login';

import React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { mockApi } from "./mockApi";

//Teste gerado pelo GPT, somente para testar se o jest está funcionando (somente o import de login está pegando)

describe("Login", () => {
    it("deve redirecionar o usuário para a página inicial após o login", () => {
        
    const { getByText } = render(<Login api={api} />);
        // render(<Login />)
    // Cria um mock da API de login
    const api = mockApi();
    api.signIn.mockResolvedValue({
      status: 200,
      body: {
        token: "1234567890",
      },
    });

    // Renderiza o componente Login

    // Simula o envio do formulário de login
    const emailInput = getByText("Email");
    const passwordInput = getByText("Senha");
    const submitButton = getByText("Entrar");

    userEvent.type(emailInput, "teste@email.com");
    userEvent.type(passwordInput, "123456");
    userEvent.click(submitButton);

    // Verifica se o usuário foi redirecionado para a página inicial
    expect(screen.getByText("Bem-vindo")).toBeInTheDocument();
  });
});