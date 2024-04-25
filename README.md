# images-to-s3-action

GitHub action to upload images to S3.


<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Upload images to S3
on:
  push:
    paths:
      - "**.jpg"
      - "**.png"
      - "**.webp"

jobs:
  images_to_s3:
    runs-on: macOS-latest
    name: Upload images to S3
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
      - name: Upload images
        uses: katydecorah/images-to-s3-action@v4.0.0
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY}}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_BUCKET: ${{ secrets.AWS_BUCKET }}
        with:
          image_path: "./img/staging/"
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git commit -am "Delete uploaded images"
          git push
```

## Action options

- `image_path`: Required. Path to images folder with images you want to upload. Default: `./img/staging/`.
<!-- END GENERATED DOCUMENTATION -->
