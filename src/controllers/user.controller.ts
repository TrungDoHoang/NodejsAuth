import { SORT_DIRECTION } from "@/constants";
import { SearchDto } from "@/dtos/index.dto";
import { UserService } from "@/services/user.service";
import { IParamListQuery } from "@/types";
import { Request, Response } from "express";
import i18next from "i18next";

export class UserController {
  // define services
  private userService: UserService;

  // define constructor and inject services
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Retrieves a paginated list of users
   * @param req Express request object containing pagination query parameters
   * @param res Express response object for sending the user list
   * Returns a paginated list of users with page and per page metadata
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async index(req: Request, res: Response) {
    try {
      const perPage = parseInt((req.query as IParamListQuery).perPage) || 10;
      const page = parseInt((req.query as IParamListQuery).page) || 1;
      const sortBy = (req.query as IParamListQuery).sortBy || "createdAt";
      const sortDirection =
        (req.query as IParamListQuery).sortDirection || SORT_DIRECTION.DESC;
      const users = await this.userService.listUsers(
        perPage,
        page,
        sortBy,
        sortDirection
      );
      res.status(200).json({
        page,
        perPage,
        data: users,
      });
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Retrieves a specific user by their ID
   * @param req Express request object containing the user ID in params
   * @param res Express response object for sending the user data
   * Returns the user details with a 200 status code
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async show(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.status(200).json({ data: user });
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Updates a specific user's information
   * @param req Express request object containing the user ID in params and updated user data in body
   * @param res Express response object for sending the updated user data
   * Returns the updated user details with a 200 status code
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async update(req: Request, res: Response) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json({ data: user });
    } catch (error) {
      console.log("Update user error:", error);
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Deletes a specific user by their ID
   * @param req Express request object containing the user ID in params
   * @param res Express response object for sending the deleted user data
   * Returns the deleted user details with a 200 status code
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async destroy(req: Request, res: Response) {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      res.status(200).json({ data: user });
    } catch (error) {
      console.log("Delete user error:", error);

      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Restores a previously deleted user by their ID
   * @param req Express request object containing the user ID in params
   * @param res Express response object for sending the restored user data
   * Returns the restored user details with a 200 status code
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async restore(req: Request, res: Response) {
    try {
      const user = await this.userService.restoreUser(req.params.id);
      res.status(200).json({ data: user });
    } catch (error) {
      console.log("Restore user error:", error);
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Retrieves a paginated list of deleted users
   * @param req Express request object containing pagination query parameters
   * @param res Express response object for sending the list of deleted users
   * Returns a paginated list of deleted users with page and perPage metadata
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async usersDeleted(req: Request, res: Response) {
    try {
      const perPage = parseInt((req.query as IParamListQuery).perPage) || 10;
      const page = parseInt((req.query as IParamListQuery).page) || 1;
      const sortBy = (req.query as IParamListQuery).sortBy || "createdAt";
      const sortDirection =
        (req.query as IParamListQuery).sortDirection || SORT_DIRECTION.DESC;
      const users = await this.userService.usersDeleted(
        perPage,
        page,
        sortBy,
        sortDirection
      );
      res.status(200).json({
        page,
        perPage,
        data: users,
      });
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }

  /**
   * Searches users based on a keyword search with pagination and sorting options
   * @param req Express request object containing search parameters and pagination query
   * @param res Express response object for sending the search results
   * Returns a paginated list of users matching the search criteria with page and perPage metadata
   * Handles potential errors and returns appropriate HTTP status codes
   */
  async searchUsers(req: Request, res: Response) {
    try {
      const perPage = parseInt((req.query as IParamListQuery).perPage) || 10;
      const page = parseInt((req.query as IParamListQuery).page) || 1;
      const sortBy = (req.query as IParamListQuery).sortBy || "createdAt";
      const sortDirection =
        (req.query as IParamListQuery).sortDirection || SORT_DIRECTION.DESC;
      const keywordSearch = (req.body as SearchDto).keywordSearch;
      const users = await this.userService.searchUsers(
        keywordSearch,
        perPage,
        page,
        sortBy,
        sortDirection
      );
      res.status(200).json({
        page,
        perPage,
        data: users,
      });
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: i18next.t("error.server.internal") });
    }
  }
}
