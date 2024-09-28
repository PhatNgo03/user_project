// src/app/user/page.tsx
const EmployeesHomePage = () => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    return (
        <div>
            <h1>User Home Page</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.name}!</p>
                </div>
            ) : (
                <p>Actions ....

                </p>
            )}
        </div>
    );
};

export default EmployeesHomePage;
