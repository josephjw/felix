import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'client/app/services/main.service';
import { HelperService } from 'client/app/services/helper.service';
import { environment } from '../../../../../../environments/environment'

@Component({
  selector: 'app-modal-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @Input() show: Boolean;
  @Input() object: any;
  @Input() bucket: any;
  @Input() currentPath;
  @Output() onHide = new EventEmitter<any>();

  expireTime = 0
  shareToken: any = ''

  API_URL = environment.API_URL

  constructor(private mainService: MainService, private helperService: HelperService) { }

  ngOnInit() {
    Date.prototype['addHours'] = function (h) {
      this.setHours(this.getHours() + h);
      return this;
    }
  }

  copyToClipBoard(path) {
    this.helperService.copyToClipboard(path)
  }

  shareObject(objectName) {

    const now = new Date();

    const data = {
      bucketName: this.bucket.bucketName,
      path: this.currentPath,
      fileName: objectName,
      sharingExpiresOn: now.setHours(now.getHours() + this.expireTime).toString()
    }

    this.mainService.shareObject(data).subscribe((res: any) => {

      if (res.success) {
        this.shareToken = res.token
      }

    })
  }

  hideModal() {
    this.onHide.emit({ success: false })
  }
}
