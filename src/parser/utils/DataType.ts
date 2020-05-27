import { ParserError } from "../error";

type TypeParameter = {
  name: string;
  type: DataType;
  order: number;
};

export default class DataType {
  static isList(t: DataType) {
    return t.type === 'List';
  }

  static ListOf(t: DataType, nullable = false) {
    const dt = new DataType('List', nullable);
    dt.newTypeParameter('element', t);
    return dt;
  }

  static isInvalid(t: DataType) {
    return t.isEqualTo(DataType.Invalid);
  }

  static isVoid(t: DataType) {
    return t.isEqualTo(DataType.Void);
  }

  static Generic(name: string, nullable = false) {
    const dt = new DataType(name, nullable);
    dt.isGeneric = true;
    return dt;
  }

  static Num = new DataType('Num');
  static Str = new DataType('Str');
  static Bool = new DataType('Bool');
  static Null = new DataType('Null');
  static Void = new DataType('Void');
  static Invalid = new DataType('Invalid');
  static Unknown = new DataType('Unknown');

  /* Maybe-types or Nullable-types may contain Null values */
  static Maybe = {
    Num: new DataType('Num', true),
    Str: new DataType('Str', true),
    Bool: new DataType('Bool', true),
  };

  private typeParams: Map<string, TypeParameter> = new Map();
  public readonly typeParameterMap: { [key: string]: DataType } = {};
  public readonly typeParameters: Array<TypeParameter> = [];
  public isGeneric = false;

  constructor(
    public type: string,
    public readonly nullable: boolean = false
  ) {}

  public toString(): string {
    const typeParams = this.typeParameters;
    let typeParamsString = '';
    if (typeParams.length !== 0)
      typeParamsString = `<${typeParams.map(t =>  t.type)}>`;
    return `${this.nullable ? 'maybe ' : ''}${this.type}${typeParamsString}`;
  }

  // For instance, Num is assignable to Maybe Num (or Num?)
  public isAssignableTo(otherDT: DataType) {
    if (this.type !== otherDT.type)
      return (this.type === 'Null' && otherDT.nullable);

    return !(
      !otherDT.nullable && (this.nullable || this.type === 'Null')
    );
  }

  public isNotAssignableTo(otherDT: DataType) {
    return !this.isAssignableTo(otherDT);
  }

  public isEqualTo(otherDT: DataType) {
    return this.toString() === otherDT.toString();
  }

  public isNotEqualTo(otherDT: DataType) {
    return this.toString() !== otherDT.toString();
  }

  public toNullable(): DataType {
    if (DataType.isList(this)) {
      const el = this.getTypeParameter('element');
      return DataType.ListOf(el.type, true);
    }
    return new DataType(this.type, true);
  }

  public newTypeParameter(paramName: string, type?: DataType) {
    const dt = type ?? DataType.Unknown;

    const tp: TypeParameter = {
      name: paramName,
      type: dt,
      order: this.typeParams.size + 1
    };

    this.typeParams.set(paramName, tp);
    this.typeParameterMap[paramName] = dt;
    this.typeParameters.push(tp);
  }

  public getTypeParameter(paramName: string): TypeParameter {
    if (this.typeParams.has(paramName))
      return this.typeParams.get(paramName) as TypeParameter;
    ParserError(`Type \`${this}\` has no type parameter of name \`${paramName}\``);
  }

  public hasTypeParameters(): boolean {
    return this.typeParams.size !== 0;
  }

  public applyTypeParametersFrom(fromDT: DataType): DataType {
    const mapping = fromDT.typeParameterMap;
    const dt = new DataType(this.type);
    this.typeParameters.forEach(tp => {
      dt.newTypeParameter(tp.name, tp.type.isGeneric ? mapping[tp.name] : tp.type);
    });
    return dt;
  }
}
