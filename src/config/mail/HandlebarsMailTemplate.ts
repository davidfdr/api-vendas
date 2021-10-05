import handlebars from 'handlebars';
import fs from 'fs';
import AppError from '@shared/errors/AppError';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  template?: string;
  file?: string;
  variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({
    template,
    file,
    variables,
  }: IParseMailTemplate): Promise<string> {
    if (file) {
      const templateFileContent = await fs.promises.readFile(file, {
        encoding: 'utf-8',
      });
      const parseTemplate = handlebars.compile(templateFileContent);
      return parseTemplate(variables);
    } else {
      if (template) {
        const parseTemplate = handlebars.compile(template);
        return parseTemplate(variables);
      }
    }
    throw new AppError('Could not find template or template file for e-mail!');
  }
}
