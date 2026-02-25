---
layout: article
title: "Setting up an Active Directory lab"
date: 2026-02-14 11:36:00 -0300
complexity: "Medium"
tags: [active-directory, windows-server, virtualbox, lab]
---
* TOC
{:toc}

## 1. Preparation and Downloads

Before starting, you must download and install the following tools on your personal computer:

- **Oracle VirtualBox**.
- **Windows Server 2019 or higher** ISO image (in this case we will use version 2022).
- **Windows 10 or Windows 11** ISO image (for the client machine).

## 2. Domain Controller (DC) Virtual Machine Configuration

Create a new virtual machine in VirtualBox to be your server:

- **Name:** "DC" (or another name of your choice).
- **RAM:** At least **2 GB (2048 MB)**.
- **Processor:** If possible, increase to **4 cores**.
- **Network:** Configure **two network adapters (NICs)**.
- **Adapter 1:** Connected in **NAT** mode (for external internet access).
- **Adapter 2:** Connected to the VirtualBox **Internal Network** (where clients will connect) and choose a name of your preference or leave the default (LAN 2).

> **Additional Settings:** Change the Shared Clipboard and Drag and Drop feature to **Bi-directional** in the advanced settings.

## 3. Windows Server 2022 Installation

Start the VM and select the Server 2022 ISO.

- Choose the **"Standard Desktop Experience"** version to have a graphical user interface (GUI).
- Perform a custom installation and format the disk.
- Set an administrator password (e.g., **Password1**).
- When starting the VM, click **Yes** to allow discovery of other PCs on the network.

> **Tip:** Install the VirtualBox **Guest Additions** to improve mouse performance and allow screen resizing.

## 4. Server IP and Name Configuration

On the installed Windows Server:

1. **Rename Computer:** Change the PC name to **"DC"**:
   - Access: `Settings > System > About > Rename this PC (Advanced)`.
   - Restart the VM.
2. **Identify Adapters:**
   - Click the network icon <img src="/assets/images/network-icon.png" alt="Network Icon" style="width: 25px;"> in the taskbar.
   - Click on `Network` > `Change adapter settings`.
   - Identify the internal network adapter by right-clicking > **Status** > **Details** (it will usually have an automatic IP address `169.254.x.x`) and rename it as **"Internal"**.
3. **Configure a Static IP on the Internal Network:**
   - Right-click on the **Internal** adapter, select **Properties**, double-click on **Internet Protocol Version 4 (TCP/IPv4)**.
   - Configure the internal network's IPv4 address with **172.16.0.1** and mask **255.255.255.0**, and leave the default gateway blank.
   - Set the preferred DNS server as **172.16.0.1** or as the loopback address **127.0.0.1**, as the server will use itself for DNS.

See the table below for more details:

| Interface                | Type           | IP Address     | Mask              | DNS           |
| :----------------------- | :------------- | :------------- | :---------------- | :------------ |
| **Adapter 1 (NAT)**      | WAN (Internet) | DHCP (NAT)     | -                 | -             |
| **Adapter 2 (Internal)** | LAN (Internal) | **172.16.0.1** | **255.255.255.0** | **127.0.0.1** |

> **Attention:** When executing the `nslookup` command, the resolver may return the message: **Default Server: Unknown Address: 172.16.0.1**. To resolve this, follow the steps below to create the Reverse Zone.

### Creating the Reverse Zone

1. Open the **DNS Manager** (`dnsmgmt.msc`) on the Domain Controller.
2. Expand the server and right-click on **Reverse Lookup Zones** > **New Zone...**
3. In the Wizard:
   - **Zone Type:** Primary Zone (stored in Active Directory).
   - **Replication Scope:** To all DNS servers running on domain controllers in this domain.
   - **IP Protocol:** IPv4.
   - **Network ID:** Enter the first octets of your network (e.g., `172.16.0`).

### Creating a PTR (Pointer) Record

For the DNS server to identify itself correctly, it needs its own PTR record:

- Within the newly created zone, right-click in the central panel and select **New Pointer (PTR)**.
- In the **Host IP** field, enter the end of the server's address (e.g., `1`).
- In the **Hostname** field, point to the FQDN of the DNS server (e.g., `dc.mydomain.com`).

### Updating Client Records

For the computers on the network to also appear correctly:

- Go to the properties of the **Forward Lookup Zone**.
- Ensure that the **Update associated pointer (PTR) record** option is checked (this automates the process via DHCP/Host Registration).

## 5. Active Directory Installation and Domain Promotion

- In **Server Manager**, go to "Add Roles and Features" and install **Active Directory Domain Services (AD DS)**.
- After installation, click the flag icon with the yellow triangle and select **"Promote this server to a domain controller"**.
- Select **"Add a new forest"** and define:
  - **Root Domain Name**: `mydomain.com` (or your preferred name).
- Follow the instructions and the server will automatically restart as a Domain Controller.

## 6. NAT and DHCP Configuration

To allow clients on the internal network to browse the internet through the DC:

- **NAT (Routing and Remote Access):** Install the **Remote Access** role and configure **NAT** using the network interface that has internet access **(Adapter 1)**.
- **DHCP**:

- In **Server Manager**, click on **Add Roles and Features**.
- Proceed through the initial screens until you reach **Server Roles** and select **DHCP Server**.
- Click on **Add Features** when prompted, and proceed with the installation until the end.
- Go to **Tools > DHCP** to open the management console.
- Go to your domain name and click next to it to expand.
- Go to IPv4, right-click > **New Scope**.
- In **Name**, enter the desired IP range: **172.16.0.100-200** and click next.
- **Start IP Address**: `172.16.0.100`
- **End IP Address**: `172.16.0.200`
- **Length**: `24`
- **Exclusions:** No exclusions are necessary for this basic lab, just click next.
- **Lease Duration:** The default is **8 days**, which is adequate for the lab.
- Configure **Router (Gateway)** as `172.16.0.1`.
- In **DNS Server**, add the IP `172.16.0.1` (if there is a different address, delete it).

The DHCP service will only start distributing IPs after being authorized in the domain:

- At the end of the wizard, select **Yes, I want to activate this scope now**.
- In the DHCP console, right-click the server name and select **Authorize**.
- Right-click again and select **Refresh**. The IPv4 icons should change from red to **green**.
- **Restart the Service:** Right-click the DHCP server > **All Tasks > Restart**.

## 7. Bulk User Creation (PowerShell)

Use a PowerShell script to automatically create 100 users for testing.

1. Before downloading the script, disable the Windows Server protection that prevents downloads:
   - In **Server Manager**, click **Local Server**.
   - Locate **IE Enhanced Security Configuration**.
   - Change to **"Off"** for Administrators and Users.
2. Script Preparation:
   - Download the scripts from your repository: <a href="https://github.com/0xK4z/Active-Directory-Scripts/" target="_blank" rel="noopener noreferrer">Active-Directory-Scripts</a>
   - Edit the script **Bulk-User-Creation.ps1** as needed.
3. Open **PowerShell ISE** as administrator.
4. Run the command below to allow script execution:

   ```powershell
   Set-ExecutionPolicy Unrestricted
   ```

5. Run the script **Bulk-User-Creation.ps1** to create an Organizational Unit (OU) called \_Employees and populate AD with the accounts.

## 8. Client Configuration (Windows 11)

1. Create a VM for Windows 11 Pro or Enterprise and configure the network only as Internal Network (make sure to choose the same name configured on the DC's internal network).
2. After installing Windows, verify that it received an IP address from your DHCP server (ipconfig /renew command if necessary).
3. Join the Domain: In system settings, change the computer name to "CLIENT1" and add it to the mydomain.com domain.
   - Access: Settings > System > About > Rename this PC (Advanced).
4. Restart and log in using one of the user accounts created in AD.

## 9. Validation Test

Open the Command Prompt (CMD) on the client machine:

    - Use the command ping google.com to test NAT (internet access).
    - Use the command nslookup mydomain.com to test DNS.
    - Type whoami to confirm correct login to the domain.
