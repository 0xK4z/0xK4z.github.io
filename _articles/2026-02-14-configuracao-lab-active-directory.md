---
layout: article
title: "Configuração de um laboratório do Active Directory"
date: 2026-02-14 11:36:00 -0300
complexity: "Medium"
tags: [active-directory, windows-server, virtualbox, lab]
---
* TOC
{:toc}

## 1. Preparação e Downloads

Antes de iniciar, você deve baixar e instalar as seguintes ferramentas em seu computador pessoal:

- **Oracle VirtualBox**.
- Imagem **ISO do Windows Server 2019 ou superior** (neste caso usaremos a versão 2022).
- Imagem **ISO do Windows 10 ou Windows 11** (para a máquina cliente).

> **Nota:** Estarei utilizando a versão do Windows em inglês como base para este tutorial.

## 2. Configuração da Máquina Virtual do Domain Controller (DC)

Crie uma nova máquina virtual no VirtualBox para ser o seu servidor:

- **Nome:** "DC" (ou algum outro de sua escolha).
- **RAM:** Pelo menos **2 GB (2048 MB)**.
- **Processador:** Se possível, aumente para **4 núcleos**.
- **Rede:** Configure **dois adaptadores de rede (NICs)**.
- **Adaptador 1:** Conectado em modo **NAT** (para acesso à internet externa).
- **Adaptador 2:** Conectado à **Rede Interna** (Internal Network) do VirtualBox (onde os clientes se conectarão) e escolha um nome de sua preferência ou deixe o padrão (LAN 2).
  > **Configurações Adicionais:** Altere a Área de Transferência Compartilhada e o recurso de Arrastar e Soltar para **Bi-direcional** nas configurações avançadas.

## 3. Instalação do Windows Server 2022

Inicie a VM e selecione a ISO do Server 2022.

- Escolha a versão **"Standard Desktop Experience"** para ter uma interface gráfica (GUI).
- Realize uma instalação personalizada ("Custom") e formate o disco.
- Defina uma senha de administrador (ex: **Password1**).
- Ao iniciar a VM, clique em **Yes** para permitir a descoberta de outros PCs pela rede.

> **Dica:** Instale os **Guest Additions** do VirtualBox para melhorar o desempenho do mouse e permitir o redimensionamento da tela.

## 4. Configuração de IP e Nome do Servidor

No Windows Server instalado:

1. **Renomear Computador:** Altere o nome do PC para **"DC"**:
   - Acesse: `Settings > System > About > Rename this PC (Advanced)`.
   - Reinicie a VM.
2. **Identificar Adaptadores:**
   - Clique no ícone de rede <img src="/assets/images/network-icon.png" alt="Ícone de Rede" style="width: 25px;"> na barra de tarefas.
   - Clique em `Network` > `Change adapter settings`.
   - Identifique qual é a placa de rede interna clicando com o botão direito > **Status** > **Details** (geralmente terá um IP automático `169.254.x.x`) e renomeie-a como **"Internal"**.
3. **Configurar IP Estático na Rede Interna:**
   - Clique com o botão direito no Adaptador **Internal**, selecione **Properties**, dê dois cliques em **Internet Protocol Version 4 (TCP/IPv4)**.
   - Configure o IPv4 da rede interna com o endereço **172.16.0.1** e máscara **255.255.255.0** e deixe o Gateway padrão em branco.
   - Defina o servidor DNS preferencial como **172.16.0.1** ou como o endereço de loopback **127.0.0.1**, pois o servidor usará a si mesmo para DNS.

Veja a tabela abaixo para mais detalhes:

| Interface                  | Tipo           | Endereço IP    | Máscara           | DNS           |
| :------------------------- | :------------- | :------------- | :---------------- | :------------ |
| **Adaptador 1 (NAT)**      | WAN (Internet) | DHCP (NAT)     | -                 | -             |
| **Adaptador 2 (Internal)** | LAN (Internal) | **172.16.0.1** | **255.255.255.0** | **127.0.0.1** |

> **Atenção:** Ao executar o comando `nslookup`, o resolvedor pode retornar a mensagem: **Default Server: UnKnown Address: 172.16.0.1**. Para resolver isso, siga os passos abaixo para criar a Zona Reversa.

### Criação da Zona Reversa

1. Abra o **Gerenciador DNS** (`dnsmgmt.msc`) no Controlador de Domínio.
2. Expanda o servidor e clique com o botão direito em **Zonas de Pesquisa Reversa** > **Nova Zona...**
3. No Assistente:
   - **Tipo de Zona:** Zona Principal (armazenada no Active Directory).
   - **Escopo de Replicação:** Para todos os servidores DNS executados em controladores de domínio neste domínio.
   - **Protocolo IP:** IPv4.
   - **ID da Rede:** Digite os primeiros octetos da sua rede (ex: `172.16.0`).

### Criação do Registro PTR (Pointer)

Para que o servidor DNS se identifique corretamente, ele precisa de um registro PTR próprio:

- Dentro da nova zona criada, clique com o botão direito no painel central e selecione **Novo Ponteiro (PTR)**.
- No campo **IP do Host**, coloque o final do endereço do servidor (ex: `1`).
- No campo **Nome do Host**, aponte para o FQDN do servidor DNS (ex: `dc.mydomain.com`).

### Atualização de Registros de Clientes

Para que os computadores da rede também apareçam corretamente:

- Vá até as propriedades da **Zona de Pesquisa Direta**.
- Garanta que a opção **Atualizar registro de ponteiro (PTR) associado** esteja marcada (isso automatiza o processo via DHCP/Registro de Host).

## 5. Instalação do Active Directory e Promoção a Domínio

- No **Server Manager**, vá em "Add Roles and Features" e instale o **Active Directory Domain Services (AD DS)**.
- Após a instalação, clique no ícone da bandeira com o triângulo amarelo e selecione **"Promote this server to a domain controller"**.
- Selecione **"Add a new forest"** e defina:
  - **Root Domain Name**: `mydomain.com` (ou o nome de sua preferência).
- Siga as instruções e o servidor reiniciará automaticamente como um Controlador de Domínio.

## 6. Configuração de NAT e DHCP

Para que os clientes na rede interna naveguem na internet através do DC:

- **NAT (Routing and Remote Access):** Instale a função de **Remote Access** e configure o **NAT** utilizando a interface de rede que tem acesso à internet **(Adaptador 1)**.
- **DHCP**:
  1.  No **Server Manager**, clique em **Add Roles and Features**.
  2.  Avance as telas iniciais até chegar em **Server Roles** e selecione **DHCP Server**.
  3.  Clique em **Add Features** quando solicitado, e prossiga com a instalação até o fim.
  4.  Vá em **Tools > DHCP** para abrir o console de gerenciamento.
  5.  Vá no seu nome de domínio e clique ao lado para expandir.
  6.  Vá no IPv4, clique com o botão direito > **New Scope**.
  7.  Em **Name**, coloque o IP range desejado: **172.16.0.100-200** e clique em next.
  8.  **Start IP Address**: `172.16.0.100`
  9.  **End IP Address**: `172.16.0.200`
  10. **Length**: `24`
  11. **Exclusions:** Não é necessário adicionar exclusões para este laboratório básico, apenas clique em next.
  12. **Lease Duration:** O padrão é **8 dias**, o que é adequado para o laboratório.
  13. Configure **Router (Gateway)** como `172.16.0.1`.
  14. Em **DNS Server** adicione o IP `172.16.0.1` (se houver um endereço diferente, exclua-o).

O serviço DHCP só passará a distribuir IPs após ser autorizado no domínio:

- No final do assistente, selecione **Yes, I want to activate this scope now**.
- No console do DHCP, clique com o botão direito no nome do servidor e selecione **Authorize**.
- Clique com o botão direito novamente e selecione **Refresh**. Os ícones do IPv4 devem mudar de vermelho para **verde**.
- **Reinicie o Serviço:** Clique com o botão direito no servidor DHCP > **All Tasks > Restart**.

## 7. Criação de Usuários em Massa (PowerShell)

Utilize um script PowerShell para criar automaticamente 100 usuários para testes.

1. Antes de baixar os scripts, desative a proteção do Windows Server que impede downloads:
   - No **Server Manager**, clique em **Local Server**.
   - Localize **IE Enhanced Security Configuration**.
   - Mude para **"Off"** para Administradores e Usuários.
2. Preparação do Script:
   - Baixe os scripts no repositório: <a href="https://github.com/0xK4z/Active-Directory-Scripts/" target="_blank" rel="noopener noreferrer">Active-Directory-Scripts</a>
   - Edite o script **Bulk-User-Creation.ps1** conforme sua necessidade.
3. Abra o **PowerShell ISE** como administrador.
4. Execute o comando abaixo para permitir a execução de scripts:

   ```powershell
   Set-ExecutionPolicy Unrestricted
   ```

5. Execute o script **Bulk-User-Creation.ps1** para criar uma Unidade Organizacional (OU) chamada \_Employees e popular o AD com as contas.

## 8. Configuração do Cliente (Windows 11)

1. Crie uma VM para o Windows 11 Pro ou Enterprise e configure a rede apenas como Internal Network (certifique-se de escolher o mesmo nome configurado na rede interna do DC).
2. Após instalar o Windows, verifique se ele recebeu um IP do seu servidor DHCP (comando ipconfig /renew se necessário).
3. Ingressar no Domínio: Nas configurações de sistema, altere o nome do computador para "CLIENT1" e adicione-o ao domínio mydomain.com.
   - Acesse: Settings > System > About > Rename this PC (Advanced).

4. Reinicie e faça login utilizando uma das contas de usuário criadas no AD.

## 9. Teste de Validação

Abra o Prompt de Comando (CMD) na máquina cliente:

- Utilize o comando ping google.com para testar o NAT (acesso à internet).
- Utilize o comando nslookup mydomain.com para testar o DNS.
- Digite whoami para confirmar o login correto no domínio.
