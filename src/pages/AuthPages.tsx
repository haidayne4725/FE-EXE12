import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, demoCustomer, demoAdmin } from "../services/authService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    try {
      const res = await login({ email, password });
      if (res && res.user) {
        navigate(res.user.role === "ADMIN" ? "/admin" : "/");
      }
    } catch {
      setError("Email hoặc mật khẩu không chính xác.");
    }
  };

  const handleQuickDemoCustomer = () => {
    demoCustomer();
    navigate("/");
  };

  const handleQuickDemoAdmin = () => {
    demoAdmin();
    navigate("/admin");
  };

  return (
    <main className="greenify-auth-page container">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại trang chủ
      </Link>

      <div className="auth-card-container">
        <div className="auth-brand-logo">Greenify</div>
        <h1 className="auth-title">Chào mừng trở lại</h1>
        <p className="auth-subtitle">Đăng nhập để tiếp tục mua sắm</p>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="label-row">
              <label>Mật khẩu</label>
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-primary-btn">
            Đăng nhập
          </button>
        </form>

        {/* DEMO QUICK LOGIN BUTTONS */}
        <div className="demo-quick-login-box">
          <span className="demo-label">Đăng nhập nhanh 1-Click:</span>
          <div className="demo-btn-row">
            <button type="button" className="demo-pill-btn customer" onClick={handleQuickDemoCustomer}>
              <User size={14} /> Khách Hàng (Nguyễn Văn A)
            </button>
            <button type="button" className="demo-pill-btn admin" onClick={handleQuickDemoAdmin}>
              <Sparkles size={14} /> Quản Trị Viên (Admin)
            </button>
          </div>
        </div>

        <div className="auth-footer-link">
          Chưa có tài khoản? <Link to="/register"><strong>Đăng ký ngay</strong></Link>
        </div>
      </div>
    </main>
  );
}

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    demoCustomer();
    navigate("/");
  };

  return (
    <main className="greenify-auth-page container">
      <Link to="/" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại trang chủ
      </Link>

      <div className="auth-card-container">
        <div className="auth-brand-logo">Greenify</div>
        <h1 className="auth-title">Đăng ký tài khoản</h1>
        <p className="auth-subtitle">Tạo tài khoản để trải nghiệm dịch vụ Terrarium tốt nhất</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label>Họ và tên</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Số điện thoại</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-primary-btn">
            Tạo tài khoản
          </button>
        </form>

        <div className="auth-footer-link">
          Đã có tài khoản? <Link to="/login"><strong>Đăng nhập ngay</strong></Link>
        </div>
      </div>
    </main>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="greenify-auth-page container">
      <Link to="/login" className="auth-back-link">
        <ArrowLeft size={16} /> Quay lại đăng nhập
      </Link>

      <div className="auth-card-container">
        <div className="auth-brand-logo">Greenify</div>
        <h1 className="auth-title">Quên mật khẩu</h1>
        <p className="auth-subtitle">Nhập email để nhận liên kết khôi phục mật khẩu</p>

        {submitted ? (
          <div className="auth-success-banner">
            Đã gửi liên kết khôi phục tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến của bạn.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label>Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-primary-btn">
              Gửi liên kết khôi phục
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
