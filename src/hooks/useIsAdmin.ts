import { EUserRoles } from "../Domain/User";
import { useGetUserQuery } from "../services/UserApi";

export const useIsAdmin = (): boolean => {
    const { data: user } = useGetUserQuery();

    if (!user?.auth_enabled) {
        return true;
    }

    // when authorization is not enabled all users have admin rights
    return user.role === EUserRoles.Admin;
};
