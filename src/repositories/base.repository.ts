import {
  Attributes,
  FindOptions,
  Model,
  ModelCtor,
  NonNullFindOptions,
} from "sequelize";

export abstract class BaseRepository<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async findAll(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(
    id: number | string,
    options?: Omit<FindOptions<Attributes<T>>, "where">
  ): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async findOne(options: FindOptions<Attributes<T>>): Promise<T | null> {
    return this.model.findOne(options);
  }

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async update(id: any, data: any): Promise<[number, T[]]> {
    const [affectedCount, affectedRows] = await this.model.update(data, {
      where: { id },
      returning: true,
    });
    return [affectedCount, affectedRows];
  }

  async delete(id: Pick<Attributes<T>, "id">): Promise<number> {
    return this.model.destroy({ where: { id } });
  }
}
