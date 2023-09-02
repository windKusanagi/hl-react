import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const container = document.getElementById('app') as HTMLDivElement;
const root = createRoot(container);
root.render(<RouterProvider router={createHashRouter(routes)} />);
