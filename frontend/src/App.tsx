import { Toaster } from "react-hot-toast"
import { Outlet } from "react-router-dom"
import { useAuthUser } from "./features/auth/hooks/useAuthUser";
import TopLoader from "./shared/components/TopLoader";

function App() {
  const { isLoading} = useAuthUser();
  if(isLoading) return <TopLoader loading={isLoading}/>
  
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: "env(safe-area-inset-top)",
          },
        }}
      />
      <Outlet />
    </>
  )
}

export default App
