---
layout: writeup
title: "PowerShell Keylogger (LetsDefend)"
date: 2026-03-09 15:52:11 -0300
summary: "A technical breakdown of the \"PowerShell Keylogger\" challenge on LetsDefend, covering persistence, DLL injection, and C2 communication."
complexity: "Low"
tags: [powershell, windows, keylogger, malware]
---

### Introduction

The "PowerShell Keylogger" challenge tasks investigators with analyzing a script to understand its behavior. Keyloggers are a common form of spyware used to capture keystrokes, often leading to the theft of credentials and sensitive information.

### Step-by-Step Analysis

#### 1. Network Configuration: The Proxy Port

Malware often uses proxies to mask its origin or to route traffic through the Tor network. In this script, the attacker configured a specific port for communication.

- **Question:** What is the proxy port used by the script?
- **Answer:** **9050**

> **Note:** Port 9050 is the default port for the Tor proxy service (SOCKS).

#### 2. Core Functionality: Starting the Capture

To begin the malicious activity, the script defines a specific function or method. Identifying this is crucial for understanding the script's entry point for data collection.

- **Question:** What function-method is used for starting keylogging?
- **Answer:** `Start-Keylogger`

#### 3. Data Storage: The Log File

Once keystrokes are captured, they must be stored locally before being exfiltrated to the attacker's server.

- **Question:** What is the name of the file used by the script to store the keylog data?
- **Answer:** `keylog.txt`

#### 4. Maintaining Access: Persistence

Persistence ensures that the malware survives a system reboot. Attackers often use registry keys, scheduled tasks, or specific script commands to remain on the system.

- **Question:** What command is used by the script to achieve persistence?
- **Answer:** `persist`

#### 5. Data Exfiltration: The Upload Command

The script needs a way to send the `keylog.txt` file back to the Command and Control (C2) server. It uses a specific keyword or command to trigger this upload.

- **Question:** What is the command used by the script to upload data?
- **Answer:** `upload:`

#### 6. Evasion and Filtering: IP Regex

To avoid detection or to ensure it is only targeting specific environments, the script uses a Regular Expression (Regex) to filter out certain IP addresses, likely loopback or link-local addresses.

- **Question:** What is the regex used by the script to filter IP addresses?
- **Answer:** `^(127\.|169\.254\.)`
- **Explanation:** This regex matches `127.x.x.x` (localhost) and `169.254.x.x` (APIPA addresses).

#### 7. Interacting with Windows: The Imported DLL

PowerShell scripts often call low-level Windows APIs to perform advanced tasks like monitoring keyboard input. This is done by importing Dynamic Link Libraries (DLLs).

- **Question:** What is the DLL imported by the script to call keylogging APIs?
- **Answer:** `user32.dll`

> **Technical Detail:** `user32.dll` contains the functions necessary for UI handling and capturing keyboard events (like `SetWindowsHookEx`).

#### 8. Resilience: Connection Retries

If the connection to the C2 server fails, the script is programmed to wait before trying again, preventing it from overwhelming the system or being too "noisy" in the logs.

- **Question:** How many seconds does the script wait before re-establishing a connection?
- **Answer:** **60**
