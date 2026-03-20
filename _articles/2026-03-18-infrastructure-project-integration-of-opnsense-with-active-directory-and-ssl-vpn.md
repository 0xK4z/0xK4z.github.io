---
layout: article
title: "Infrastructure Project: Integration of OPNsense with Active Directory and SSL VPN"
date: 2026-03-18 14:15:43 -0300
summary: "This project integrates OPNsense as a secure firewall with Active Directory for centralized user management, enabling secure remote access via OpenVPN with AD group-based authentication."
complexity: "High"
tags: ['opnsense', 'active-directory', 'virtuallab']
---
* TOC
{:toc}

# Infrastructure Project: Integration of OPNsense with Active Directory and SSL VPN

## 1. Project Overview
This project documents the implementation of a secure network infrastructure using **OPNsense** as a central firewall/gateway and **Microsoft Active Directory (AD)** as a domain controller and identity provider (IdP). The main objective is to establish a simulated corporate environment with centralized user management, hybrid name resolution, perimeter security with IDS/IPS, and secure remote access via OpenVPN with AD group-based authentication.

## 2. Network Topology and Technologies
*   **Firewall/Gateway:** OPNsense 24.x
*   **Domain Controller:** Windows Server 2022 (Active Directory Domain Services)
*   **Network Segmentation:**
    *   **LAN:** 172.16.0.0/24 (Gateway: 172.16.0.254)
    *   **VPN Roadwarrior:** 10.0.8.0/24
*   **Critical Services:** DNS Unbound, DHCP Server (AD), OpenVPN, IDS/IPS (Suricata).

---

## 3. OPNsense Firewall Implementation

### 3.1. Initial Installation and Configuration (Wizard)
The installation followed a *hardened* BSD standard. After initial boot, the following configurations were applied via the Wizard:

*   **Hostname/Domain:** Set to `fw-core.mydomain.com`. Using a FQDN is essential for proper SSL certificate issuance.
*   **DNS External:** Configured with IP `1.1.1.1` (Cloudflare) for upstream resolution.
*   **WAN Interface (em0):** Configured via DHCP to receive provider/hypervisor IP.
*   **LAN Interface (em1):** Set with static IP **172.16.0.254/24**.
    *   *Technical Note:* The OPNsense DHCP Server was explicitly **disabled** on this interface to avoid conflicts (Split-Brain) with the AD DHCP service.
*   **Stack Optimization:** IPv6 was disabled in `Interfaces > WAN > IPv6 Configuration Type: None` to reduce attack surface and simplify internal routing.

### 3.2. DNS and Visibility Configuration
To ensure internal monitoring and name resolution:
1.  **Query Forwarding:** OPNsense was configured to forward specific queries to the local resolver running on the host (192.168.0.4), ensuring recursive resolution.
2.  **Logging:** Detailed logging was enabled in `Reporting > Unbound DNS` for auditing malicious domain requests.

---

## 4. Active Directory (AD DS and AD CS) Configuration

The Domain Controller acts as the "source of truth" for the network.

1.  **Network Adjustments (DC):**
    *   IP Address: 172.16.0.1
    *   Gateway: 172.16.0.254 (points to OPNsense).
2.  **DHCP Server:** Configured for the LAN, setting the OPNsense IP (172.16.0.254) as the **Router (Gateway)** for clients.
3.  **DNS Forwarder:** In the Windows DNS console, configured a *Forwarder* to the OPNsense IP. This ensures that external domain queries pass through the firewall's security filter.
4.  **AD CS (Active Directory Certificate Services):** Installed and configured to enable LDAPS (LDAP over SSL). Although the lab uses port 389 for initial tests, the infrastructure is prepared for migration to port 636 (Production).

---

## 5. OPNsense + Active Directory (LDAP) Integration

To enable the firewall to "see" users from the domain, we configured an external authentication server:

*   **Path:** `System > Access > Servers`
*   **Descriptive Name:** `AD_Corp`
*   **Type:** LDAP
*   **Hostname:** 172.16.0.1 (DC IP)
*   **Port:** 389 (Standard TCP)
*   **Bind Credentials:**
    *   User DN: `CN=opnsense,OU=Service Accounts,DC=mydomain,DC=com`
    *   *Note:* A common user account without administrative privileges, following the **Principle of Least Privilege**.
*   **Search Base (DN):** `DC=mydomain,DC=com`
*   **Synchronization Options:** Activated `Synchronize groups` to import AD security groups into OPNsense, facilitating VPN access control.
*   **Read Properties:** Enabled.

---
><center>
><img src=":/e924d78b33b440deb460e53ca339d623" width="200" />
><img src=":/ad1d5ac5d35c443098b3b73d2aec70bb" width="200" />
>
>**Figure 1 and 2: Details of the Bind DN and Authentication Containers for integration with AD.**
></center>

---

## 6. Remote Access VPN (OpenVPN) Implementation

The VPN solution was designed to offer robust security and ease of connection.

### 6.1. Public Key Infrastructure (PKI)
1.  **Certificate Authority (CA):** Created `CA_FW` internally in OPNsense.
2.  **Server Certificate:** Created `CERT-SSLVPN-SERVER`, signed by `CA_FW`.
3.  **Client Certificate:** Created `CERT-SSLVPN-CLIENT` for certificate-based authentication (Double Factor: Certificate + AD credentials).
4.  **TLS Static Key:** Generated the `SSLVPN` key for encrypting control channel and protecting against DoS attacks.

---
><center>
><img src=":/01558f5e58b643a5afc623ff3c2c973a" width="200" />
><img src=":/897f664ddd8d43c5b6bc829ab3bc3056" width="200" />
>
>**Figures 3 and 4: Trust Authorities configured, including the internal CA_FW and signed Server and Client certificates.**
</center>

---

### 6.2. OpenVPN Instance Configuration
*   **Protocol/Port:** UDP 1194 (Better performance for tunnels).
*   **Mode:** TUN (Layer 3 - Routed).
*   **Tunnel Network (IPv4 Virtual Network):** 10.0.8.0/24.
*   **Authentication:** Selected the `AD_Corp` server.
*   **RBAC (Role-Based Access Control):** Option `Enforce local group` set for the `SSLVPN` group. Only AD users belonging to this group can close the connection.
*   **DNS Push:** Configured to push domain `mydomain.com` and IP `10.0.8.1` to clients, ensuring remote users resolve internal AD names.

---
><center>
><img src=":/cedbdf261c11464dabae0dad2a0d41f6" width="200" />
><img src=":/e915f19766a1425d97d132ae0fcfb86e" width="200" />
><img src=":/05a95e3e84aa4fb4bedcd287004f83a0" width="200" />
><img src=":/16fa892be7324d039cda98cf6568d160" width="200" />
>
>**Figures 5 to 8: Detailed setup of the OpenVPN instance, routing, and DNS push options.**
</center>

---

### 6.3. Static TLS Key
To enhance security against denial-of-service (DoS) and port scans, a static TLS key was implemented.

---
><center>
> <img src=":/2b39f25f1831425495c5cd6fc875a0aa" width="200" />
>
>**Figure 9: Static TLS key used for control authentication.**
</center>

---

### 6.4. Firewall Rules
Specific rules were created to allow traffic:
1.  **WAN:** Allow traffic on UDP 1194 to the WAN interface IP.
2.   **LAN:** Allow DNS (port 53) for the DC and firewall, as well as web navigation.
3.  **OpenVPN Interface:** Allow traffic from the `OpenVPN net` interface to necessary LAN resources.

---
>
><center>
> <img src=":/a7ad65dcde7c4389a71e86016b70404e" width="200" />
><img src=":/48a5a014fdee41df9a745e46ddb16665" width="200" />
><img src=":/208561b322434c11b40e92528f76d2d9" width="200" />
>
>**Figures 10 to 12: LAN, WAN, and OpenVPN interface rules prioritizing DNS, secure web access, and VPN network access.**
</center>

---

## 7. Advanced Security and Monitoring

### 7.1. IDS/IPS (Suricata)
Enabled the intrusion detection and prevention system (Suricata) on border interfaces. This allows deep packet inspection (DPI) to detect malware, exploits, and network scans.

### 7.2. Client Export and Testing
For user provisioning:
1.  Used the **Client Export** module.
2.  Set the Hostname as the public/DNS dynamic IP address of the lab.
3.  Added custom directives to the `.ovpn` file:
    ```bash
    ping 10
    ping-restart 60
    dhcp-option ADAPTER_DOMAIN_SUFFIX mydomain.com
    ```
**Validation:** Test was performed from an external network (isolated VM). The user authenticated using AD credentials, received an IP from the 10.0.8.0/24 network, and successfully pinged and accessed services in the `mydomain.com` domain, validating the integration.

---
><center>
><img src=":/f7e4bbce15df4770ba61056f2b104a7e" width="200" />
>
>**Figure 13: Export interface with Custom Config (ping 10, ping-restart 60).**
</center>

---

## 8. Validation and Results
The final test involved connecting a client outside the local network using AD credentials.

*   **Status:** Connected successfully.
*   **IP Received:** 10.0.8.x.
*   **Name Resolution:** The client was able to resolve internal names via DNS push configured.

><center>
><img src=":/f14776a7e5f94b8294b1d2d0d3d7cd31" width="200" />
><img src=":/0a93e1d1a9b84235812814ed3791cbd3" width="200" />
>
>**Figures 14 and 15: Evidence of successful OpenVPN connection for AD user.**
</center>

---

## 9. Conclusion
This project demonstrates the viability of using high-performance open-source tools (OPNsense) integrated with Microsoft Windows ecosystems. The implementation ensures a solid security posture, with detailed DNS logging, active perimeter protection, and scalable, secure remote access, aligned with best practices for corporate network architecture.

---
**Documented by:** [0xK4z]  
**Technologies:** OPNsense, Active Directory, OpenVPN, LDAP, PKI.
