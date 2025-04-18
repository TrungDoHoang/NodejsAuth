import { User } from "@/models";
import { RoleAttributes, UserCreationAttributes } from "@/types";

export interface IUserService {
  /**
   * Retrieves a paginated list of users from the system.
   * @param perPage The number of users to return per page.
   * @param page The page number of user results to retrieve.
   * @param sortBy The field to sort the users by.
   * @param sortDirection The direction of sorting (e.g., 'asc' or 'desc').
   * @returns A promise that resolves to an array of user objects for the specified page.
   */
  listUsers(
    perPage: number,
    page: number,
    sortBy: string,
    sortDirection: string
  ): Promise<User[]>;

  /**
   * Retrieves a specific user by their unique identifier.
   * @param id The unique identifier of the user to retrieve.
   * @returns A promise that resolves to the user object, or any if the user is not found.
   */
  getUser(id: string): Promise<IUser | null>;

  /**
   * Updates an existing user's information in the system.
   * @param id The unique identifier of the user to update.
   * @param user The updated user object containing new information.
   * @returns A promise that resolves to the updated user object, or null if the update fails.
   */
  updateUser(id: string, user: UserCreationAttributes): Promise<IUser | null>;

  /**
   * Deletes a specific user from the system.
   * @param id The unique identifier of the user to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  deleteUser(id: string): Promise<boolean>;

  /**
   * Retrieves a paginated list of deleted users from the system.
   * @param perPage The number of deleted users to return per page.
   * @param page The page number of deleted user results to retrieve.
   * @param sortBy The field to sort the deleted users by.
   * @param sortDirection The direction of sorting (e.g., 'asc' or 'desc').
   * @returns A promise that resolves to an array of deleted user objects for the specified page.
   */
  usersDeleted(
    perPage: number,
    page: number,
    sortBy: string,
    sortDirection: string
  ): Promise<User[]>;

  /**
   * Restores a previously deleted user to the system.
   * @param id The unique identifier of the user to restore.
   * @returns A promise that resolves to a boolean indicating whether the user was successfully restored.
   */
  restoreUser(id: string): Promise<boolean>;

  /**
   * Searches for users based on a keyword search with optional pagination and sorting.
   * @param keywordSearch The search term to find users by username, email, or other searchable fields.
   * @param perPage The number of users to return per page.
   * @param page The page number of search results to retrieve.
   * @param sortBy The field to sort the search results by.
   * @param sortDirection The direction of sorting (e.g., 'asc' or 'desc').
   * @param isSearchDeleted Optional flag to include deleted users in the search results.
   * @returns A promise that resolves to an array of users matching the search criteria.
   */
  searchUsers(
    keywordSearch: string,
    perPage: number,
    page: number,
    sortBy: string,
    sortDirection: string,
    isSearchDeleted?: boolean
  ): Promise<User[]>;
}
export interface IUser {
  id: string;
  username: string;
  email: string;
  roles: RoleAttributes[];
}
