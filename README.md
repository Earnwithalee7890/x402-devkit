# 🛠️ x402 DevKit

The official developer kit for **x402 payments** on the Stacks blockchain. This repository provides a unified environment for building, testing, and deploying pay-per-call API services.

## 📦 Included Packages
This devkit integrates the following core components:

### ⚡ Conduit (@earnwithalee/x402-conduit)
A pay-per-call API marketplace where AI agents autonomously discover and pay for services using STX.
- **Source**: `./conduit`
- **NPM**: `https://www.npmjs.com/package/@earnwithalee/x402-conduit`

## 🚀 Quick Start

### Installation
Install the devkit and its core dependencies:
```bash
npm install
```

### Exploring Conduit
To run the Conduit marketplace locally:
```bash
cd conduit
npm install
npm run dev
```

### Running Agent Demos
See how AI agents interact with the x402 protocol:
```bash
cd conduit
npm run agent:demo
```

## 🏗️ Architecture
- **`/conduit`**: Source code for the Conduit marketplace, including Express server, Vanilla JS frontend, and Clarity smart contracts.
- **Root**: DevKit configuration and integrated dependency management.

Built with ❤️ for the x402 Stacks ecosystem.
