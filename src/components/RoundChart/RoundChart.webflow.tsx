import { declareComponent } from '@webflow/react';
import { RoundChart } from './RoundChart';
import { props } from '@webflow/data-types';

export default declareComponent(RoundChart, {
  name: 'Round Chart',
  description: 'A customizable round chart (Doughnut or Pie)',
  group: 'Charts',
  props: {
    value: props.Number({
      name: 'Value',
      defaultValue: 75,
      min: 0,
      max: 100,
    }),
    mainText: props.Text({
        name: 'Main Text',
        defaultValue: '75',
    }),
    chartColor: props.Text({
      name: 'Chart Color',
      defaultValue: '#007bff',
    }),
    baseColor: props.Text({
      name: 'Base Color',
      defaultValue: '#e9ecef',
    }),
    chartType: props.Variant({
      name: 'Chart Type',
      options: ['Doughnut', 'Pie'],
      defaultValue: 'Doughnut',
    }),
    angle: props.Variant({
      name: 'Chart Angle',
      options: ['360', '180'],
      defaultValue: '360',
    }),
    caption: props.Text({
      name: 'Caption Text',
      defaultValue: '% of customers who use channels in a single transaction',
    }),
    sourceText: props.Text({
      name: 'Source Text',
      defaultValue: 'Bloomberg',
    }),
    sourceLink: props.Link({
      name: 'Source Link',
    }),
  },
});