import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService, SpinnerService } from './core';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

// rxjs
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

private sub: Subscription;

constructor(
  public messagesService: MessagesService,
  public spinnerService: SpinnerService,
  private router: Router,
  private titleService: Title,
  private metaService: Meta) {}

onActivate($event) {
  console.log('Activated Component', $event);
}

onDeactivate($event) {
  console.log('Deactivated Component', $event);
}

onDisplayMessages(): void {
  this.router.navigate([{outlets:{messages:['messages']}}]);
  this.messagesService.isDisplayed = true;
}
ngOnInit() {
  this.setPageTitlesAndMeta();
}

ngOnDestroy() {
  this.sub.unsubscribe();
}

private setPageTitlesAndMeta() {
    this.sub = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(
        data => {
          this.titleService.setTitle(data.title);
          this.metaService.addTags(data.meta);
      });
    }
}
