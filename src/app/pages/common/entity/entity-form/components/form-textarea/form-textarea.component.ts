import {
  Component, ViewChild, ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { FieldConfig } from '../../models/field-config.interface';
import { Field } from '../../models/field.interface';
import globalHelptext from 'app/../../helptext/global-helptext';

@Component({
  selector: 'form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['../dynamic-field/dynamic-field.scss'],
})
export class FormTextareaComponent implements Field {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;

  config: FieldConfig;
  group: FormGroup;
  fieldShow: string;
  private hasPasteEvent = false;
  fileString: string | ArrayBuffer;

  constructor(public translate: TranslateService) {}

  blurEvent(): void {
    if (this.config.blurStatus) {
      this.config.blurEvent(this.config.parent);
    }
  }

  onPaste(event: ClipboardEvent): void {
    this.hasPasteEvent = true;
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    if (pastedText.startsWith(' ')) {
      this.config.warnings = globalHelptext.pasteValueStartsWithSpace;
    } else if (pastedText.endsWith(' ')) {
      this.config.warnings = globalHelptext.pasteValueEndsWithSpace;
    }
  }

  onInput(): void {
    if (this.hasPasteEvent) {
      this.hasPasteEvent = false;
    } else {
      this.config.warnings = null;
    }
  }

  changeListener($event: Event): void {
    this.readFile($event.target);
  }

  readFile(inputValue: any): void {
    var file: File = inputValue.files[0];
    var fReader: FileReader = new FileReader();

    fReader.onloadend = () => {
      this.fileString = fReader.result;
      this.contents(fReader.result);
    };
    if (this.config.fileType == 'binary') {
      fReader.readAsBinaryString(file);
    } else {
      fReader.readAsText(file);
    }
  }

  contents(result: any): void {
    if (this.config.fileType == 'binary') {
      this.group.controls[this.config.name].setValue(btoa(result));
    } else {
      this.group.controls[this.config.name].setValue(result);
    }
  }

  fileBtnClick(): void {
    this.fileInput.nativeElement.click();
  }
}
