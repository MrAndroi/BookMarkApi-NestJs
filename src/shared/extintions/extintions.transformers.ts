export function transformMany(models: any[], transformOption = {}, serializer): any[] {
    return models.map((model) => transform(model, transformOption, serializer));

}

export function transform(model: any, transformOption = {}, serializer): any {
    return new serializer(model, transformOption);
}