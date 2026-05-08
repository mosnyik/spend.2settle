# 2Settle Live Chat Website 🌐

2Settle is a solution built to enable users to easily spend or send cryptocurrency in fiat currency. Currently, the platform supports spending or sending the following cryptocurrencies:

- ![Bitcoin](https://img.icons8.com/color/20/000000/bitcoin--v1.png) **BTC** on the BTC Network
- ![Ethereum](https://img.icons8.com/color/20/000000/ethereum.png) **ETH** on ERC20
- ![Binance](https://img.icons8.com/?size=20&id=7ILoITdFEW19&format=png&color=000000) **BNB** on ERC20
- ![Tron](https://img.icons8.com/?size=20&id=7NCvsu15urpd&format=png&color=000000) **TRX** on TRC20
- ![Tether](https://img.icons8.com/color/20/000000/tether.png) **USDT** on ERC20, BEP20, and TRC20

---

## Features ✨
- Multi-chain cryptocurrency support (BTC, ETH, BNB, TRX, USDT).
- Simple chat-based user interaction.
- Real-time bill payment/purchase.
- Real-time gift creating/claiming
- Real-tim payment request/request fulfilment

---

## Live Website 🔗
[Visit the live website](https://spend.2settle.io/)

## Preview Deployment 🌐
[Check out the preview deployment](https://chat-2settle.vercel.app/)

---

## Getting Started 🚦

### For Users 💬
To start, simply greet the bot by saying one of the following:
- `Hi`
- `Hello`
- `Howdy`

Follow the prompts to proceed with your interactions.

### Development Setup 🛠️

To run the development server locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/SIRFITECH/chat.2settle 
   ```

2. Navigate to the project directory:
   ```bash
   cd chat.2settle
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Environment Variables 🔐
Make sure to configure the following environment variables:
   ```bash
   host=<mysql_db_host_link>
   port=<mysql_db_host_port>
   user=<mysql_db_user_name>
   password=<mysql_db_password>
   database=<mysql_db_database_name>
   COINMARKETCAP_API_KEY=<current_crypto_coin_to_dollar_exchange_rate_api>
   TWILIO_ACCOUNT_SID=<twilio_sid>
   TWILIO_AUTH_TOKEN=<Twilio_auth_token>
   TWILIO_PHONE_NUMBER=<twilio_phone_number>
   ```

---

## Folder Structure 🗂️
```plaintext
/__tests__
/public      
src/
│
├── /pages
│   ├── /api
│   ├── /transact
│   ├── /history
│   ├── /reportly
│   ├── /settings
│   └── _app.js
│   └── index.js
│
├── /components
│   ├── /shared
│   ├── /transactions
│   ├── /history
│   ├── /reports
│   ├── /settings
│   └── /modals
│
├── /features
│   ├── /transact
│   ├── /history
│   ├── /reportly
│   └── /settings
│
├── /hooks
│   ├── useTransaction.js
│   ├── useTheme.js
│   └── useUserPreferences.js
│
├── /utils
│   ├── api.js
│   ├── auth.js
│   ├── date.js
│   ├── errorHandling.js
│   └── validation.js
│
├── /styles
│   ├── globals.css
│   ├── tailwind.css
│   └── components.css
│
├── /services
│   ├── transactionService.js
│   ├── userService.js
│   ├── reportService.js
│   ├── walletService.js
│   └── bankService.js
│
├── /context
│   ├── ThemeProvider.js
│   ├── AuthProvider.js
│   └── TransactionProvider.js
│
├── /public
│   ├── /images
│   └── /icons
│
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
├── README.md
└── tsconfig.json 

```

---

## Built With 💡

- **Next.js** (App Router) - A React framework for building server-side rendered and static web applications.
- **Tailwind CSS** - A utility-first CSS framework for styling.
- **DaisyUI** - A Tailwind CSS component library for building beautiful user interfaces effortlessly.

---

## Testing 🧪
To run tests (if available):
```bash
pnpm test
```

---

## Deployment 🚀
The project is deployed on **Vercel**. To deploy updates:
1. Push changes to the `main` branch.
2. Vercel automatically builds and deploys the project.

---

## Known Issues or Limitations ⚠️
- Currently, only supports a predefined set of cryptocurrencies.
- Limited fiat currency disbursement options.

---

## Contributing 🤝
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a pull request.

---

## License 📜
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact or Support 📧
For questions or support, please contact:
- **Email**: support@2settle.io
- **Website**: [2Settle.io](https://spend.2settle.io/)
