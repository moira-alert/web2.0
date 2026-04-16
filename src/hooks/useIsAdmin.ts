import { EUserRoles } from "../Domain/User";
import { useGetUserQuery } from "../services/UserApi";

export const useIsAdmin = (): boolean => {
    const { data: user } = useGetUserQuery();

    if (!user?.auth_enabled) {
        return true;
    }

    return user.role === EUserRoles.Admin;
};
