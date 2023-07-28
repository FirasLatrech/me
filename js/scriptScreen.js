// Lookat function
$.fn.lookAt = function (target_coordinates, reinit) {
  let position;
  if (reinit === null) {
    reinit = false;
  }
  let { x } = target_coordinates;
  let { y } = target_coordinates;
  if (!this.data('position') || reinit === true) {
    position = {
      x: this.offset().left,
      y: this.offset().top };

    this.data('position', position);
  } else {
    position = this.data('position');
  }
  let angle = Math.atan2(y - position.y, x - position.x);
  this.css('transform', `rotate(${angle}rad)`);
};

// Follow Class
class Followme {
  static initClass() {
    this.prototype.defaults = {
      dumping: 1,
      disable: false,
      coordiantes_to_follow: {
        x: 0,
        y: 0 },

      offset: {
        x: 0,
        y: 0 },

      onChange(coordinates) {} };

  }

  setCoordinates(data) {
    return this.options.coordiantes_to_follow = data;
  }

  follow() {
    let dumping;
    if (!this.element.data("dumping")) {
      dumping = this.element.data("dumping") || this.options.dumping;
      this.element.data("dumping", dumping);
    } else {
      dumping = this.element.data("dumping");
    }
    // Offset element
    let offset = this.element.offset();
    let xd = this.options.offset.x + this.options.coordiantes_to_follow.x - offset.left;
    let yd = this.options.offset.y + this.options.coordiantes_to_follow.y - offset.top;

    let coordinates = {
      x: offset.left + xd / dumping,
      y: offset.top + yd / dumping };


    this.element.css({
      "left": coordinates.x,
      "top": coordinates.y });


    this.options.onChange(coordinates);

    if (!this.disable) {
      return requestAnimationFrame(() => this.follow());
    }
  }

  // Constructor class
  constructor(element, options) {
    // Set options
    this.options = $.extend({}, this.defaults, options);
    this.element = $(element);
    this.disable = this.options.disable;

    if (!this.disable) {
      this.follow();
    }
  }}

Followme.initClass();

// Create Elements
let elements = [
  {
    'type': 'donut',
    'number': 5
  },
  {
    'type': 'square',
    'number': 10
  },
  {
    'type': 'diamond',
    'number': 10
  },
  {
    'type': 'sausage',
    'number': 10
  },
  {
    'type': 'plus',
    'number': 10
  }
];

let items = [];
$.each(elements, function (i, element) {
  let numElements = $(window).width() <= 500 ? Math.min(element.number, 5) : element.number;
  for (let i = 0; i < numElements; i++) {
    let item = $(`<div class="item_container"><div class="${element.type}"></div></div>`);
    item.css({
      'left': Math.random() * $(window).width(),
      'top': Math.random() * $(window).height()
    });
    items.push(item);
    $('body').append(item);
  }
});

// Init
const LA = new Followme("#lookat-target", {
  onChange: coordinates => {
    return $.each(items, (i, e) =>
    requestAnimationFrame(() => {
      return $(e).lookAt({ x: coordinates.x, y: coordinates.y });
    }));

  }
});

$(window).on("mousemove.followme", e => {
  return LA.setCoordinates({
    x: e.pageX,
    y: e.pageY
  });
});
