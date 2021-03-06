import { Component, OnInit, HostListener, Inject } from '@angular/core';
import {PrismicService} from '../shared/prismic.service';
import {GlobalService} from '../shared/variables.service';
import {IFeed}from './feed';
import { DOCUMENT } from '@angular/common';
// import fade in animation
import { fadeInAnimation } from './../_animation/index';

@Component({
  // selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  // make fade in animation available to this component
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class FeedComponent implements OnInit {

  public innerHeight: number = window.innerHeight;
  pageTitle: string = 'Product List';
  paginationInProcess: boolean=false;
  listFilter: string;
  errorMessage: string;
  feed: IFeed;


     constructor(
       private _globalService: GlobalService,
       private _feedService: PrismicService,
       @Inject(DOCUMENT) private document: Document
     ){}

    //  toggleImage(): void {
    //    this.showImage = !this.showImage;
    //  }



     ngOnInit(): void{
      this._globalService.setLoading(true);
       console.log('ng on init');
       console.log(this.feed);
       if(!this.feed){
         this.getPage(1);
       }
     }


     concatResults(obj): void{
       console.log("concat results")
      this.feed.results= this.feed.results.concat(obj.results);
      this.feed.page=obj.page;
      this.feed.total_pages=obj.total_pages;
      this.feed.prev_page=obj.prev_page;

      console.log(this.feed);
     }


     getPage(page): void{
       this.paginationInProcess=true;
       this._feedService.getFeed('post', page)
       .subscribe(
         feed=>{
           if(page==1){
             this.feed=feed;
             this._globalService.setLoading(false);
           }else{this.concatResults(feed)}
           this.paginationInProcess=false;
         },
         error=>{
           this.errorMessage=error;
           this._globalService.setLoading(false);
           this.paginationInProcess=false;
         }
       );
     }



     @HostListener("window:scroll", [])
      onWindowScroll() {
        let number = this.document.body.scrollTop;
        console.log(window.innerHeight);
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        var windowBottom = window.innerHeight + window.pageYOffset;
        if ((windowBottom >= docHeight) &&(this.paginationInProcess==false)) {
            // alert('bottom reached');
            if(this.feed){
              if((this.feed.page+1)<this.feed.total_pages){
                this.getPage(this.feed.page+1);
              }
            }
        }
      }

}
