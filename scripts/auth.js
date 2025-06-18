// 注册功能
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", function (e) {
      e.preventDefault();
  
      const username = document.getElementById("regUsername").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
  
      if (localStorage.getItem(email)) {
        alert("该邮箱已被注册！");
        return;
      }
  
      users = { username, password };
      localStorage.setItem(email, JSON.stringify(users));
  
      alert("注册成功，请登录！");
      window.location.href = "../index.html";
    });
}
  
  // 登录功能
  if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
  
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
  
      const user = localStorage.getItem(email);
  
      if (!user) {
        alert("该用户未注册！");
        return;
      }
  
      if (JSON.parse(user).password !== password) {
        alert("密码错误！");
        return;
      }
      
      // 保存当前登录用户的完整信息
      const userData = JSON.parse(user);
      const currentUser = {
        username: userData.username,
        email: email,
        password: userData.password
      };
      
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", userData.username);

      window.location.href = "pages/home.html";
      
    });
}

  