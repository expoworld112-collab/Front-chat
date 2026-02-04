import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BoarderAnimatedContainer";
import { MessageCircleIcon , Lock , Mail  ,LoaderIcon} from "lucide-react";
import { Link } from "react-router-dom";
function LoginPage() {
    const [formData ,setFormData] = useState({ email: "" , password: ""});
    const {login , isLoggingin} = useAuthStore() ;
   
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);

  };
  return (
    <div className="w-full flex item-center justify-center p-4  bg-slate-900">
      <div className="relative w-full  max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* form coloum - left side*/}
            <div className="md:w-1/2 p-8  flex item-center justify-center md:border-r  border-slate-600/30">
             <div className="w-full max-w-md" >
                {/* Heading text  */}
                <div className="text-center mb-8" >
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                  <p className="text slate-400">Login to access your  account</p>

                </div>
                {/*form*/}
                <form onSubmit={handleSubmit} className="space-y-6">
                
                  {/*----email-------------*/}
                  <div>
                    {/* <label className="w-12 h-12 mx-auto text-slate-400 mb-4"></label> */}
                    <label className="auth-input-label">Email</label>
                    <div className="releative">
                      {/* <UserIcon className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-slate-400"/> */}
                      <Mail className="auth-input-icon" />
                      <input  
                        type="text"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="Enter your email"
                      />
                    </div>

                  </div>

                  {/*----password------------*/}
                  <div>
                    {/* <label className="w-12 h-12 mx-auto text-slate-400 mb-4"></label> */}
                    <label className="auth-input-label">Password</label>
                    <div className="releative">
                      {/* <UserIcon className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-slate-400"/> */}
                      <Lock className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>

                  </div>
                  {/*----submit button------------*/}
                  <button className="auth-btn" type="submit" disabled={isLoggingin}>
                    {isLoggingin ? (<LoaderIcon className="w-5 h-5 animate-spin mx-auto" />) : (
                      "Login"
                    )}
                  </button>

                </form>
                <div className="mt-4 text-center text-slate-400">
                  <Link to="/signup" className="text-slate-200 hover:underline">
                      Not haveing account signup                  </Link>
                </div>
              </div>



            </div>
            {/*form coloum - right side*/}
            <div className="hidden md:w-1/2 md:flex item-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img src="/login.png"
                alt="people-using mobile devices"
                className="w-full h-auto object-contain" />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-slate-200 mb-2"> Connect any time anywhere</h3>
                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Free </span>
                  <span className="auth-badge">easy setup </span>
                  <span className="auth-badge">private </span>
                </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>

      </div>
    </div>

  );
}

export default LoginPage;
