# Deploy Tripify On Render

## 1) Push This Repo To GitHub

Render will deploy from your GitHub repository.

## 2) Create Blueprint On Render

1. In Render dashboard, click `New +` -> `Blueprint`.
2. Select this repository.
3. Render will detect `render.yaml` and create:
   - `tripify-backend` (Node web service)
   - `tripify-frontend` (static site)

## 3) Set Required Secret

In `tripify-backend` service env vars, set:

- `MONGODB_URI` = your MongoDB Atlas URI

## 4) Update Service URLs

After first deploy, replace placeholder URLs in Render env vars:

- Backend `FRONTEND_ORIGIN` = your frontend Render URL
- Frontend `VITE_API_URL` = `https://<your-backend-url>/api`

Then redeploy both services.

## 5) Done

Frontend will call backend API on Render, and backend will connect to Atlas.
