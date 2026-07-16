import { UserLogin } from "../components/userPageCpmponent/UserCreate";
import { DeleteUserByIdDropdown } from "../components/userPageCpmponent/UserDelete";
import { UserTable } from "../components/userPageCpmponent/UserTable";

export default function UserManagmentPage() {
    return (
        <div className="container text-center">
            <div className="row g-5">
                <div className="col">
                    <UserLogin />
                </div>
                <div className="col">
                    <UserTable />
                </div>
            </div>
            <div className="row g-5">
                <div className="col">
                    <DeleteUserByIdDropdown />
                </div>
            </div>
        </div>
    );
}