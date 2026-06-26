(function() {
  'use strict';

  var chartInstance = null;

  function readCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  window.initRadarChart = function() {
    var container = document.getElementById('radarChart');
    if (!container) return;
    if (chartInstance) {
      chartInstance.resize();
      return;
    }

    var accent = readCSSVar('--accent');
    var accent2 = readCSSVar('--accent2');
    var ink = readCSSVar('--ink');
    var muted = readCSSVar('--muted');
    var rule = readCSSVar('--rule');
    var bg2 = readCSSVar('--bg2');

    chartInstance = echarts.init(container, null, { renderer: 'svg' });

    var option = {
      animation: true,
      animationDuration: 800,
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: bg2,
        borderColor: rule,
        textStyle: { color: ink, fontSize: 13 }
      },
      legend: {
        data: ['当前水平', '目标水平'],
        bottom: 0,
        textStyle: { color: muted, fontSize: 12 },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20
      },
      radar: {
        indicator: [
          { name: '绩点', max: 100 },
          { name: '科研', max: 100 },
          { name: '竞赛', max: 100 },
          { name: '英语', max: 100 },
          { name: '实习', max: 100 }
        ],
        shape: 'polygon',
        radius: '65%',
        center: ['50%', '46%'],
        axisName: {
          color: ink,
          fontSize: 13,
          fontWeight: 600
        },
        splitArea: {
          areaStyle: {
            color: ['transparent', 'transparent', 'transparent', 'transparent']
          }
        },
        splitLine: {
          lineStyle: {
            color: rule,
            width: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: rule,
            width: 1
          }
        }
      },
      series: [{
        name: '能力评估',
        type: 'radar',
        data: [
          {
            value: [65, 30, 40, 55, 20],
            name: '当前水平',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              color: accent,
              width: 2
            },
            itemStyle: {
              color: accent,
              borderColor: accent,
              borderWidth: 2
            },
            areaStyle: {
              color: hexToRgba(accent, 0.15)
            }
          },
          {
            value: [90, 85, 80, 85, 60],
            name: '目标水平',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              color: accent2,
              width: 2,
              type: 'dashed'
            },
            itemStyle: {
              color: accent2,
              borderColor: accent2,
              borderWidth: 2
            },
            areaStyle: {
              color: hexToRgba(accent2, 0.1)
            }
          }
        ]
      }]
    };

    chartInstance.setOption(option);

    window.addEventListener('resize', function() {
      chartInstance && chartInstance.resize();
    });
  };
})();
