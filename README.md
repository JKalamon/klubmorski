# Klubmorski.pl static website

This is static website for Polish Sail Club located in Kołobrzeg. You can find live version [klubmorski.pl](https://klubmorski.pl)

## Tech stack

Website is build using [HUGO](https://gohugo.io) for automatic building static HTML pages. Theme is custom written with [Bootstrap 5](https://getbootstrap.com) and some custom styles and javascripts.
It is hosted as static page on [Cloudflare](cloudflare.com)

## Optimizations

Beyond fast hosting that provides Cloudflare and static websites build without overwelming HTML tags. This website does not include full bootstrap css but only parts that it uses and all images are automatically converted to modern `.webp` format.

## How to run

For development purposes use

`hugo server -D --noHTTPCache -p 80`

and you can view site on http://localhost

This website is build automatically by Cloudflare although if you would need to build it for production build it with

`hugo`

---

If you are adding new images please remember to run 

`npm run optimize-images`