import { Controller } from '@snow';
import { LanguagesDao } from '../dao/LanguagesDao';

@Controller('/languages')
export default class LanguagesController {
  private readonly languagesDao = new LanguagesDao();

}
