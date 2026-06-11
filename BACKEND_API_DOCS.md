# Backend API Integration Documentation

Namaste! Yeh document Sonacomster frontend code (React/Vite) ko completely analyze karke banaya gaya hai. Isme saari required APIs ki details hain jo aapko backend banate waqt develop karni hongi. Jab backend API endpoints ready ho jayenge, tab aap frontend components se fake (mock) data hata kar in APIs se real data fetch kar sakte hain.

## 1. Authentication (Login Page)
**Frontend File:** `components/pages/LoginPage.jsx`

Yahan par user login functionality kaam kar rahi hai. Abhi `setTimeout` ka use karke UI me mock delay aur fake response bhej kar authentication dikhaya gaya hai.

*   **Endpoint:** `POST /api/auth/login`
*   **Request Payload (Body):**
    ```json
    {
      "employeeId": "EMP-90210",
      "password": "user_password"
    }
    ```
*   **Expected Response:** Successful login par User ki details (Name, Role, Department, Avatar, Email) aur ek Authentication Token (jaise JWT) milna chahiye.
*   **Action:** Backend me ek login controller banaiye jo database se credentials verify kare.

---

## 2. Dashboard Analytics & Stats
**Frontend File:** `components/pages/Dashboard.jsx`

Dashboard page par total statistics, haal hi me aayi reports, aur defects ka analysis show hota hai. Abhi saara data `useEffect` ke andar hardcode kiya hua hai.

Aap iske liye alag-alag APIs bana sakte hain ya ek aggregate API:
*   **Stats API:** `GET /api/dashboard/stats`
    *   **Response Data:** `{ totalReports: 1247, pending: 48, approved: 986, rejected: 213 }`
*   **Recent Reports API:** `GET /api/reports/recent`
    *   **Response Data:** Latest 4-5 reports ka array, jisme priority, status aur date shaamil ho.
*   **Top Vendors API:** `GET /api/vendors/top-issues`
    *   **Response Data:** Vendors ki list jinke material me sabse zyada defect aate hain, success rate ke sath.
*   **Defect Distribution API:** `GET /api/defects/distribution`
    *   **Response Data:** Alag-alag defects (Dimension error, Surface crack etc.) ki percentage aur counts.

---

## 3. Reports Management (My Reports)
**Frontend File:** `components/pages/MyReports.jsx`

Yahan table me saari reports ki listing, unki filtering, search query, aur pagination chal rahi hai. Frontend par filter aur pagination memory (array) par kaam kar raha hai. 

*   **List Reports API:** `GET /api/reports`
    *   **Query Params:** Jaise `?page=1&limit=5&status=pending&search=gear`
    *   **Expected Response:** Paginated reports ki list aur pagination ke metadata (totalPages).
*   **Delete Report API:** `DELETE /api/reports/:id`
    *   **Expected Response:** Success message ("Report deleted"). Abhi frontend me sirf `window.confirm` laga hai.
*   **Export Reports API:** `GET /api/reports/export`
    *   **Expected Response:** Excel ya CSV format me reports data ka blob/stream jisko user download kar sake.

---

## 4. Create New Report
**Frontend File:** `components/pages/NewReport.jsx`

Is page par user ek nayi defect/quality report submit karta hai, jisme images bhi upload hoti hain.

*   **Create Report API:** `POST /api/reports`
    *   **Request Payload:** Date, Department, Vendor, Item Code, Quantity, Defect Type, Priority, aur Description.
    *   **Expected Response:** Success status aur nayi banayi gayi report ki ID.
*   **Image Upload API:** `POST /api/upload`
    *   **Detail:** Report text submit karne se pehle (ya sath me) images upload karni hongi. Is endpoint par `multipart/form-data` bhej kar images ka server/cloud URL receive kiya jayega, jo baad me report me attach hoga.

---

## 5. Analytics & Insights
**Frontend File:** `components/pages/AnalyticsPage.jsx`

Yahan graphical data (Bar Chart, Pie Chart) render kiya ja raha hai, jisme kafi specific backend operations lagenge.

*   **Monthly Defects API:** `GET /api/analytics/defect-trends`
    *   **Response Data:** Bar chart render karne ke liye mahine ke hisaab se defect count (e.g., Jan: 45, Feb: 32).
*   **Vendor Share API:** `GET /api/analytics/vendor-distribution`
    *   **Response Data:** Pie (Donut) chart ke liye vendor-wise share percentage.
*   **KPIs Data API:** `GET /api/analytics/kpis`
    *   **Response Data:** Average Resolution Time, Cost of Quality, etc. ke current data aur unka trend percentage (+ve/-ve).

---

## 6. User Profile & Settings
**Frontend File:** `components/pages/SettingsPage.jsx`

Yahan par user profile edit karta hai aur UI theme/notification control karta hai. Is file me ek image cropper bhi embedded hai jo Base64 generated image produce karta hai.

*   **Update Profile API:** `PUT /api/users/profile`
    *   **Request Payload:** Name, Role, Department, aur Cropped Image (jo `profileImage` key me bhejenge as a base64 string ya URL).
    *   **Expected Response:** Updated user profile information.
*   **Update User Preferences:** `PUT /api/users/settings`
    *   **Request Payload:** Notification preference aur selected Language (`en`, `hi`).

---

## Summary
Aap backend start karne ke liye in API routes ko apne framework (Express/Node.js, Python Django/FastAPI, ya Java Spring) me tayar karna shuru kar sakte hain. Database me **Users**, **Reports**, aur **Vendors** ki main tables/collections banani hongi. Jab APIs ready ho jayein, toh frontend me `axios` ya `fetch` ka use karke is mock delay ko replace kar dijiyega.
