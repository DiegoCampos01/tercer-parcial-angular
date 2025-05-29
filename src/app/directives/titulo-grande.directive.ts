import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appTituloGrande]',
  standalone: true
})
export class TituloGrandeDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.fontSize = '20px';
  }
} 