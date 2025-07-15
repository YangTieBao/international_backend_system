import { Controller } from '@snow';
import { TranslationsDao } from '../dao/TranslationsDao';

@Controller('/translations')
export default class TranslationsController {
  private readonly translationsDao = new TranslationsDao();

}
