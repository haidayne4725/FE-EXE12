import { ArrowRight, BookOpen, Calendar, ArrowLeft, Heart, MessageSquare, User, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import mockData from "../mock/mockData.json";
import { currentUser } from "../services/authService";
import type { UserInfo } from "../types/auth";

export function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tất cả" },
    { id: "terarium", label: "Kiến thức Terrarium" },
    { id: "care", label: "Chăm sóc cây" },
    { id: "story", label: "Câu chuyện khởi nghiệp" },
  ];

  return (
    <main className="greenify-blog-page container">
      {/* HEADER SECTION */}
      <div className="blog-page-header">
        <div className="blog-eyebrow-badge">
          <BookOpen size={16} /> Kiến thức Terrarium
        </div>
        <h1 className="page-title">Blog</h1>
        <p className="page-subtitle">Mẹo chăm sóc cây, hướng dẫn và cảm hứng từ thế giới Terrarium</p>

        <div className="blog-category-filter">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`blog-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* BLOG CARDS GRID */}
      <div className="blogs-grid-3">
        {mockData.blogs.map((post) => (
          <article key={post.id} className="greenify-blog-card">
            <Link to={`/blog/${post.slug}`} className="blog-card-thumb">
              <img src={post.image} alt={post.title} />
            </Link>
            <div className="blog-card-body">
              <Link to={`/blog/${post.slug}`} className="blog-card-title-link">
                <h3 className="blog-card-title">{post.title}</h3>
              </Link>
              <p className="blog-card-summary">{post.summary}</p>
              <div className="blog-card-footer">
                <span className="blog-date">
                  <Calendar size={14} /> {post.publishDate}
                </span>
                <Link to={`/blog/${post.slug}`} className="read-more-link">
                  Đọc thêm <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const post = mockData.blogs.find((b) => b.slug === slug) || mockData.blogs[0];

  const [user, setUser] = useState<UserInfo | null>(() => currentUser());
  const [likes, setLikes] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const [commentsList, setCommentsList] = useState<
    Array<{
      id: string;
      userName: string;
      userRole: "ADMIN" | "CUSTOMER";
      date: string;
      content: string;
    }>
  >([
    {
      id: "c1",
      userName: "Trần Bảo Nam",
      userRole: "CUSTOMER",
      date: "2 giờ trước",
      content: "Bài viết chia sẻ rất chi tiết về thông số PAR và Kelvin! Nhà mình dùng bình 25cm chắc chọn loại 5W là chuẩn nhất.",
    },
    {
      id: "c2",
      userName: "Quản trị viên Greenify",
      userRole: "ADMIN",
      date: "1 giờ trước",
      content: "Cảm ơn bạn Nam đã quan tâm bài viết! Bạn lưu ý giữ khoảng cách đèn 3-5cm so với nắp kính để cây quang hợp tốt nhất nhé.",
    },
  ]);

  useEffect(() => {
    const syncUser = () => setUser(currentUser());
    window.addEventListener("auth-changed", syncUser);
    return () => window.removeEventListener("auth-changed", syncUser);
  }, []);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((l) => Math.max(0, l - 1));
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !user) return;

    const newComment = {
      id: `c_${Date.now()}`,
      userName: user.name,
      userRole: user.role,
      date: "Vừa xong",
      content: commentInput.trim(),
    };

    setCommentsList([newComment, ...commentsList]);
    setCommentInput("");
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentsList((prev) => prev.filter((c) => c.id !== commentId));
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="greenify-blog-detail-page container">
      <Link to="/blog" className="blog-back-link">
        <ArrowLeft size={16} /> Về trang Blog
      </Link>

      {/* ADMIN MONITOR CONTROL PANEL BANNER */}
      {user?.role === "ADMIN" && (
        <div className="admin-blog-monitor-toolbar">
          <div className="admin-status-pill">
            <Sparkles size={16} />
            <span>QUẢN TRỊ VIÊN MONITOR</span>
            <span className="status-dot online" />
            <span style={{ color: "#E2E8DC", fontWeight: "normal" }}>• Đã xuất bản</span>
          </div>
          <div className="admin-actions-group">
            <button
              type="button"
              className="admin-btn edit"
              onClick={() => alert("Trình chỉnh sửa bài viết dành cho Admin")}
            >
              ✏️ Sửa bài viết
            </button>
            <button
              type="button"
              className="admin-btn pin"
              onClick={() => alert("Đã ghim bài viết này lên đầu danh sách Blog!")}
            >
              📌 Ghim nổi bật
            </button>
            <button
              type="button"
              className="admin-btn delete"
              onClick={() => alert("Chức năng Quản trị viên: Xóa bài viết này")}
            >
              🗑️ Xóa bài
            </button>
          </div>
        </div>
      )}

      <article className="blog-article">
        <div className="article-header">
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <Calendar size={14} /> <span>{post.publishDate}</span>
          </div>
        </div>

        <div className="article-hero-img">
          <img src={post.image} alt={post.title} />
        </div>

        {/* DYNAMICALLY FORMATTED BLOG ARTICLE CONTENT */}
        <div className="article-content">
          {post.slug === "anh-sang-cho-terrarium-bi-quyet" ? (
            <>
              <blockquote className="blog-callout-box">
                <strong>Mở bài: Ánh sáng - "Trái tim" của hệ sinh thái thu nhỏ</strong>
                <br />
                <br />
                Khi ngắm nhìn một chiếc bể kính trong suốt tại Tiệm Rêu Décor, điều đầu tiên thu hút bạn có lẽ là mảng rêu xanh mướt hay những cây dương xỉ nhỏ xinh. Tuy nhiên, đằng sau sự sống động ấy, có một yếu tố vô hình nhưng lại đóng vai trò sống còn: Ánh sáng. Việc thiết lập hệ thống chiếu sáng cho không gian sống thu nhỏ (vivarium/terrarium) đòi hỏi sự tính toán cẩn thận để hệ sinh thái có thể duy trì sự sống lâu dài. Ở Việt Nam, nơi khí hậu thường xuyên nắng gắt và nhiệt độ cao, việc để bình kính dưới ánh nắng mặt trời trực tiếp rất dễ làm "luộc chín" hệ thực vật. Do đó, việc hiểu rõ và làm chủ ánh sáng nhân tạo là kỹ năng bắt buộc để duy trì mảng xanh bền lâu.
              </blockquote>

              <p className="blog-italic-intro">
                Dưới đây là bản thảo bài blog đã được bổ sung thêm mục tư vấn chi tiết về cách chọn công suất đèn (3W, 5W hay 7W). Mình đã khéo léo lồng ghép yếu tố khí hậu thực tế để bài viết mang tính "thực chiến" cao và hữu ích nhất cho người đọc:
              </p>

              <h2 className="blog-section-heading">Ánh Sáng Cho Terrarium: Bí Quyết Để Mảng Xanh Luôn Tươi Tốt Trong Nhà</h2>

              <h3 className="blog-sub-heading">Mở bài: Ánh sáng - "Trái tim" của hệ sinh thái thu nhỏ</h3>
              <p>
                Khi ngắm nhìn một chiếc bể kính trong suốt tại Tiệm Rêu Décor, điều đầu tiên thu hút bạn có lẽ là mảng rêu xanh mướt hay những cây dương xỉ nhỏ xinh. Tuy nhiên, đằng sau sự sống động ấy, có một yếu tố vô hình nhưng lại đóng vai trò sống còn: Ánh sáng. Việc thiết lập hệ thống chiếu sáng cho không gian sống thu nhỏ (vivarium/terrarium) đòi hỏi sự tính toán cẩn thận để hệ sinh thái có thể duy trì sự sống lâu dài. Ở Việt Nam, nơi khí hậu thường xuyên nắng gắt và nhiệt độ cao, việc để bình kính dưới ánh nắng mặt trời trực tiếp rất dễ làm "luộc chín" hệ thực vật. Do đó, việc hiểu rõ và làm chủ ánh sáng nhân tạo là kỹ năng bắt buộc để duy trì mảng xanh bền lâu.
              </p>

              <h3 className="blog-sub-heading">Thân bài: Giải mã các thông số ánh sáng quyết định sự sống của rêu</h3>
              <div className="blog-numbered-list">
                <p>
                  <strong>1. Nhiệt độ màu (Color Temperature - Kelvin) và Sự quang hợp:</strong>
                  <br />
                  Ánh sáng mà chúng ta nhìn thấy thực chất bao gồm một dải phổ màu rộng từ đỏ đến tím, mỗi màu mang một bước sóng khác biệt. Đối với hệ thực vật trong bể kín, nhiệt độ màu (được đo bằng thang Kelvin - K) sẽ quyết định cách chúng sinh trưởng.
                  <br />
                  Thông thường, đèn có chỉ số khoảng <strong>2700K</strong> sẽ cho ra ánh sáng trắng ấm (hơi ngả vàng), trong khi <strong>6000K</strong> sẽ tạo ra ánh sáng trắng lạnh (cool white).
                  <br />
                  <em>Ứng dụng thực tế:</em> Rêu và các loại cây kiểng lá nhiệt đới rất ưa chuộng dải ánh sáng mô phỏng ánh nắng tự nhiên (khoảng 6000K – 6500K). Sử dụng đúng dải màu giúp cây quang hợp tối đa để tạo chất dinh dưỡng mà không bị biến đổi hình thái.
                </p>

                <p>
                  <strong>2. Cường độ ánh sáng: Đừng nhầm lẫn giữa LUX và PAR:</strong>
                  <br />
                  Độ sáng của đèn là yếu tố cốt lõi để tái tạo lại môi trường sống tự nhiên cho thực vật. Tuy nhiên, nhiều người mới chơi thường chỉ chọn đèn vì "thấy nó sáng". Thực tế, cần phân biệt rõ hai chỉ số:
                  <br />
                  - <strong>LUX:</strong> Đây là thước đo độ sáng dựa trên cách mắt người cảm nhận. Chỉ số LUX cao giúp chiếc bình trông rực rỡ và lộng lẫy hơn khi trưng bày.
                  <br />
                  - <strong>PAR (Photosynthetically Active Radiation):</strong> Đây mới là "bữa ăn" thực sự của cây. Nó đo lường chính xác dải năng lượng ánh sáng mà thực vật hấp thụ để quang hợp.
                  <br />
                  <em>Ứng dụng thực tế:</em> Tại Tiệm Rêu Décor, chúng tôi đặc biệt quan tâm đến chỉ số PAR thay vì chỉ nhìn vào độ chói mắt. Một chiếc đèn dù rất sáng nhưng chỉ số PAR thấp thì rêu vẫn sẽ dần úa vàng vì "đói" năng lượng.
                </p>

                <p>
                  <strong>3. Thực chiến: Nên chọn đèn 3W, 5W hay 7W cho bình Terrarium?</strong>
                  <br />
                  Nhiều bạn thắc mắc nên mua đèn bao nhiêu Watt (W) là đủ. Thực chất, số W thể hiện mức tiêu thụ điện và tỷ lệ thuận với lượng nhiệt tỏa ra. Tùy vào thể tích bình và nhiệt độ phòng mà chúng ta có sự lựa chọn khác nhau:
                  <br />
                  - <strong>Đèn 3W – Sự lựa chọn an toàn cho bình mini:</strong> Đây là mức công suất lý tưởng cho các bình rêu để bàn có kích thước nhỏ (đường kính hoặc chiều cao dưới 15–20cm). Ưu điểm tuyệt vời của đèn 3W là rất ít tỏa nhiệt. Trong những ngày thời tiết oi bức, đây là "chân ái" giúp hạn chế tối đa tình trạng hầm hơi, đọng sương quá mức gây úng rêu.
                  <br />
                  - <strong>Đèn 5W – "Quốc dân" cho bình tầm trung:</strong> Nếu bạn sở hữu một bình cỡ trung (20–30cm), đèn 5W mang lại sự cân bằng hoàn hảo. Nó cung cấp luồng sáng đủ mạnh để xuyên qua lớp lá, giúp cây bên dưới vẫn quang hợp tốt. Tuy nhiên, bạn nên để khoảng cách từ đèn đến nắp kính tầm 3–5cm để tản nhiệt, tránh làm nóng không khí bên trong.
                  <br />
                  - <strong>Đèn 7W – Dành riêng cho bể lớn hoặc dáng cao:</strong> Ánh sáng 7W có độ xuyên thấu rất mạnh, bắt buộc phải dùng cho các bể cỡ lớn (trên 30–40cm) để rêu ở sát đáy bình không bị thiếu sáng. Lưu ý quan trọng: Công suất 7W đi kèm với lượng nhiệt khá lớn. Nếu không gian phòng của bạn không có máy lạnh và khá nóng, việc ốp sát đèn 7W vào một chiếc bình thủy tinh kín sẽ chẳng khác nào tạo ra một lò sấy, rất dễ gây sốc nhiệt cho rêu.
                </p>

                <p>
                  <strong>4. Chọn đèn ít tỏa nhiệt (Energy Efficient):</strong>
                  <br />
                  Dù chọn mức công suất nào, giải pháp tối ưu cho môi trường kín hẹp vẫn là sử dụng đèn LED chuyên dụng có quang phổ rộng (Full spectrum). Loaị đèn này vừa cung cấp đủ dải sáng cho cây, vừa tiết kiệm điện và quan trọng nhất là giữ được sự mát mẻ ổn định cho hệ sinh thái bên trong.
                </p>
              </div>

              <div className="blog-dashed-divider">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>

              <h3 className="blog-sub-heading">Làm chủ ánh sáng, làm chủ mảng xanh</h3>
              <p>
                Ánh sáng không chỉ đơn thuần là việc bật một chiếc công tắc; nó là một môn khoa học giúp tái hiện lại sự kỳ diệu của tự nhiên ngay trên bàn làm việc của bạn. Hiểu được các thông số như Kelvin, PAR hay cách chọn công suất đèn 3W, 5W, 7W chính là chìa khóa để bạn giữ cho thế giới thu nhỏ của mình luôn khỏe mạnh. Quá trình thiết kế một chiếc Terrarium luôn cần sự giao thoa giữa nghệ thuật sắp đặt và sự tính toán kỹ thuật chuẩn xác, để mỗi mảng rêu khi đến tay bạn đều nhận được môi trường sinh trưởng hoàn hảo nhất.
              </p>
            </>
          ) : (
            <>
              <blockquote className="blog-callout-box">
                <em>{post.contentParagraphs?.[0] || post.summary}</em>
              </blockquote>

              {(post.contentParagraphs?.slice(1) || []).map((para, idx) => {
                const blocks = para.split("\n\n");
                return (
                  <div key={idx} style={{ marginBottom: "1.5rem" }}>
                    {blocks.map((block, bIdx) => {
                      if (block.endsWith(":") || (block.length < 80 && !block.includes("."))) {
                        return (
                          <h2 key={bIdx} className="blog-section-heading">
                            {block}
                          </h2>
                        );
                      }
                      return (
                        <p
                          key={bIdx}
                          style={{
                            fontSize: "0.98rem",
                            lineHeight: "1.75",
                            color: "#3D4A33",
                            marginBottom: "0.85rem",
                          }}
                        >
                          {block}
                        </p>
                      );
                    })}
                  </div>
                );
              })}

              <div className="blog-dashed-divider">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>
            </>
          )}
        </div>

        {/* BLOG FOOTER ACTIONS & COMMENTS SECTION */}
        <div className="article-footer-actions">
          {/* LIKES & COMMENTS PILLS */}
          <div className="action-counts-row">
            <button
              type="button"
              className={`action-pill-btn ${hasLiked ? "active" : ""}`}
              onClick={toggleLike}
            >
              <Heart size={18} fill={hasLiked ? "#e74c3c" : "none"} color={hasLiked ? "#e74c3c" : "currentColor"} />
              <span>{likes} Yêu thích</span>
            </button>

            <button type="button" className="action-pill-btn" onClick={scrollToComments}>
              <MessageSquare size={18} />
              <span>{commentsList.length} Bình luận</span>
            </button>
          </div>

          {/* AUTH-DEPENDENT COMMENT CARD / FORM */}
          <div id="comments-section">
            {!user ? (
              /* LOGGED OUT: CLEAN FIGMA LOGIN PROMPT BANNER */
              <div className="comment-box-banner">
                <h4>Bình luận bài viết</h4>
                <p>Vui lòng đăng nhập để gửi bình luận và tương tác!</p>
                <Link to="/login" className="button dark small">
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (
              /* LOGGED IN: CLEAN COMMENT INPUT FORM (Ô BÌNH LUẬN) */
              <div className="comment-form-container">
                <div className="comment-user-header">
                  <div className="comment-user-info">
                    <span className="comment-user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                    <span className="comment-user-name">
                      {user.name}
                      {user.role === "ADMIN" ? (
                        <span className="role-badge admin">
                          <Sparkles size={12} /> Quản trị viên
                        </span>
                      ) : (
                        <span className="role-badge customer">
                          <User size={12} /> Khách hàng
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleAddComment}>
                  <div className="comment-textarea-wrap">
                    <textarea
                      rows={3}
                      placeholder="Viết bình luận của bạn về bài viết này..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                  </div>
                  <div className="comment-form-actions">
                    <button type="submit" className="button dark small" disabled={!commentInput.trim()}>
                      <MessageSquare size={16} /> Gửi bình luận
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* READER COMMENTS LIST (Ý KIẾN BẠN ĐỌC) */}
            <div className="blog-comments-section">
              <h3>Ý KIẾN BẠN ĐỌC ({commentsList.length})</h3>
              <div className="divider-line" style={{ marginBlock: "1rem" }} />

              {commentsList.length === 0 ? (
                <p className="empty-comments-text">Hãy là người đầu tiên bình luận cho bài viết này!</p>
              ) : (
                <div className="comments-list">
                  {commentsList.map((item) => (
                    <div key={item.id} className="comment-item-card">
                      <div className="comment-item-avatar">{item.userName.charAt(0).toUpperCase()}</div>
                      <div className="comment-item-body">
                        <div className="comment-item-header">
                          <span className="comment-author-name">
                            {item.userName}
                            {item.userRole === "ADMIN" ? (
                              <span className="role-badge admin">
                                <Sparkles size={12} /> Quản trị viên
                              </span>
                            ) : (
                              <span className="role-badge customer">Khách hàng</span>
                            )}
                          </span>
                          <span className="comment-time">{item.date}</span>
                        </div>
                        <p className="comment-text">{item.content}</p>
                        {(user?.role === "ADMIN" || user?.name === item.userName) && (
                          <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                            <button
                              type="button"
                              className="delete-comment-btn"
                              onClick={() => handleDeleteComment(item.id)}
                            >
                              Xóa bình luận
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="blog-discover-more" style={{ marginTop: "2.5rem" }}>
                <p>Thích bài viết này? Khám phá thêm tại</p>
                <Link to="/blog" className="button dark large-pill">
                  Xem tất cả bài viết <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
