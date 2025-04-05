// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './Components/Home/Home.jsx'
import Weather from './Components/Weather/Weather.jsx'
import WeeklyWeather from './Components/WeeklyWeather/WeeklyWeather.jsx'
import Alert from './Components/Alert/Alert.jsx'
import EarthquakeAlert from './Components/Earthquick/Earthquick.jsx'
import About from './Components/About/About.jsx'
import TermsAndConditions from './Components/TermsAndCondition/TermsAndCondition.jsx'
import Policy from './Components/Policy/Policy.jsx'
import Setting from './Components/Setting/setting.jsx'
import { LocationProvider } from './context/LocationContext.jsx' // import this

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'Forecast', element: <Weather /> },
      { path: 'WeeklyWeather', element: <WeeklyWeather /> },
      { path: 'Setting', element: <Setting /> },
      { path: 'Alert', element: <Alert /> },
      { path: 'EarthQuick-Alert', element: <EarthquakeAlert /> },
      { path: 'about', element: <About /> },
      { path: 'TermsAndConditions', element: <TermsAndConditions /> },
      { path: 'PrivacyPolicy', element: <Policy /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationProvider>
      <RouterProvider router={router} />
    </LocationProvider>
  </StrictMode>
);
