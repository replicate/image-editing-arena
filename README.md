<div align="center">
<img width="1200" alt="Image Editing Arena" src="https://github.com/user-attachments/assets/your-arena-screenshot-url" />
</div>

# Image Editing Arena - Replicate

Welcome to the Image Editing Area - Replicate repository! This project provides a web interface powered by AI for editing and enhancing images using cutting-edge models. With a focus on usability and extensibility, this repo enables both developers and end-users to leverage AI-based image manipulation right from their browser.

## Features

- ✨ **AI-powered image editing:** Use the latest models to modify, improve, or stylize your images.
- 🎨 **User-friendly interface:** Easily upload images and apply various transformations with just a few clicks.
- 🔐 **Secure and private:** All processing occurs within your environment. Your images and data stay with you.
- 🛠️ **Developer-ready:** Modular codebase, environment-based API access, and easy to extend.
- 🌐 **Run locally or deploy:** Start editing images instantly on your machine or deploy to your favorite cloud platform.

## Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/replicate/image-editing-arena.git
   cd image-editing-arena
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:5173`
   - Enter your Replicate API key when prompted (get one at [replicate.com](https://replicate.com))
   - Upload an image and enter a prompt
   - Select models and compare results side-by-side

## Deployment

### Deploy to Cloudflare Workers

1. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

Your site will be deployed to `https://image-editing-arena.<your-subdomain>.workers.dev`

### Alternative: Deploy to Cloudflare Pages

```bash
npm run cf:deploy
```

### Other Platforms

Build the static files and deploy to any static hosting:

```bash
npm run build
```

The `dist` folder can be deployed to Vercel, Netlify, GitHub Pages, etc.


## Contributing

Contributions are welcome! Please open pull requests for new features, bug fixes, or suggestions for improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch and open a pull request

## License

[MIT](LICENSE)

---

Thank you for using Image Editing Area - Replicate! If you find this project useful, please give it a star ⭐️

This contains everything you need to run your app locally.

