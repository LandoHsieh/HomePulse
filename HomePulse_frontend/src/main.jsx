import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from "./store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        //實驗功能：在Query獲取到資訊前停止渲染
        suspense: false
      }
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(

  //<React.StrictMode>
  <Provider store={store}>
  
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
    
  </Provider>

  //</React.StrictMode>

)
