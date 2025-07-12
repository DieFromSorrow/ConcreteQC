// 缺陷数据
const defectsData = {
    hole: {
        name: "孔洞",
        severity: "严重",
        confidence: "92%",
        date: "2023-07-10 10:25",
        location: "北京地铁15号线工程 - 第3施工段",
        size: "25×18mm",
        depth: "8mm",
        position: "侧墙",
        image: "https://img.zcool.cn/community/01d5d85f8a2b1511013f4720d8c86e.jpg",
        suggestion: "使用环氧树脂砂浆进行修补，修补前需清理孔洞周边松散混凝土，修补后需进行防水处理。"
    },
    crack: {
        name: "裂缝",
        severity: "中等",
        confidence: "88%",
        date: "2023-07-10 11:30",
        location: "北京地铁15号线工程 - 第2施工段",
        size: "长120mm",
        depth: "3mm",
        position: "顶板",
        image: "https://img.zcool.cn/community/01f0d75f8a2b1511013f4720a8a2d8.jpg",
        suggestion: "采用压力灌浆法注入环氧树脂胶，裂缝宽度大于0.3mm时需开槽处理后再注胶。"
    },
    honeycomb: {
        name: "蜂窝",
        severity: "中等",
        confidence: "85%",
        date: "2023-07-09 14:15",
        location: "北京地铁15号线工程 - 第1施工段",
        size: "150×200mm",
        depth: "15mm",
        position: "柱",
        image: "https://img.zcool.cn/community/01d9c85f8a2b1511013f4720f8b1d9.jpg",
        suggestion: "清除松散颗粒，用高强度水泥砂浆分层填补并压实，养护不少于7天。"
    },
    segregation: {
        name: "离析",
        severity: "低",
        confidence: "78%",
        date: "2023-07-08 09:45",
        location: "北京地铁15号线工程 - 第4施工段",
        size: "区域2㎡",
        depth: "表层",
        position: "底板",
        image: "https://img.zcool.cn/community/01f8e75f8a2b1511013f4720a8a2d8.jpg",
        suggestion: "对离析区域进行凿除处理，重新浇筑混凝土，加强振捣工艺控制。"
    },
    leakage: {
        name: "渗漏",
        severity: "严重",
        confidence: "91%",
        date: "2023-07-10 14:20",
        location: "北京地铁15号线工程 - 第3施工段",
        size: "渗漏点3处",
        depth: "贯穿",
        position: "侧墙",
        image: "https://img.zcool.cn/community/01d5d85f8a2b1511013f4720d8c86e.jpg",
        suggestion: "查找水源点，采用化学灌浆止水，表面涂刷防水涂料，设置导流槽。"
    },
    void: {
        name: "空鼓",
        severity: "低",
        confidence: "76%",
        date: "2023-07-07 16:10",
        location: "北京地铁15号线工程 - 第2施工段",
        size: "直径50-80mm",
        depth: "表层",
        position: "顶板",
        image: "https://img.zcool.cn/community/01f8e75f8a2b1511013f4720a8a2d8.jpg",
        suggestion: "钻孔注入环氧树脂，表面打磨平整，空鼓面积大于400cm²需凿除重做。"
    }
};

$(document).ready(function() {
    // 左侧面板折叠功能
    $('.sidebar-toggle').click(function() {
        $('#project-sidebar').toggleClass('collapsed');
        $('#main-content').toggleClass('expanded');

        if ($('#project-sidebar').hasClass('collapsed')) {
            $(this).html('<i class="fas fa-bars"></i>');
        } else {
            $(this).html('<i class="fas fa-times"></i>');
        }
    });

    // 项目选择功能
    $('.project-item').click(function() {
        $('.project-item').removeClass('active');
        $(this).addClass('active');
    });

    // 缺陷选择功能
    $('.defect-item').click(function() {
        $('.defect-item').removeClass('active');
        $(this).addClass('active');

        const defectType = $(this).data('type');
        updateDefectDisplay(defectType);
    });

    // 更新缺陷显示
    function updateDefectDisplay(type) {
        const defect = defectsData[type];

        $('#defect-image').attr('src', defect.image);
        $('#severity-badge').text(defect.severity);
        $('#defect-type').text(`${defect.name} (置信度 ${defect.confidence})`);
        $('#detection-date').text(defect.date);
        $('#location').text(defect.location);
        $('#defect-size').text(defect.size);
        $('#defect-depth').text(defect.depth);
        $('#defect-position').text(defect.position);
        $('#repair-suggestion').text(defect.suggestion);

        // 根据严重程度更新徽章颜色
        const badge = $('#severity-badge');
        badge.removeClass('bg-danger bg-warning bg-info');

        if (defect.severity === '严重') {
            badge.addClass('bg-danger');
        } else if (defect.severity === '中等') {
            badge.addClass('bg-warning');
        } else {
            badge.addClass('bg-info');
        }
    }

    // 初始化巡检图表
    const inspectionCtx = document.getElementById('inspectionChart').getContext('2d');
    const inspectionChart = new Chart(inspectionCtx, {
        type: 'line',
        data: {
            labels: ['6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '巡检次数',
                data: [12, 28, 38, 35, 42, 40],
                borderColor: 'rgba(56, 189, 248, 1)',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                pointBorderColor: 'rgba(56, 189, 248, 1)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });

    // 初始化缺陷分布图表
    const damageCtx = document.getElementById('damageDistributionChart').getContext('2d');
    const damageChart = new Chart(damageCtx, {
        type: 'doughnut',
        data: {
            labels: ['孔洞', '裂缝', '蜂窝', '离析', '渗漏', '空鼓'],
            datasets: [{
                data: [28, 22, 19, 15, 8, 5],
                backgroundColor: [
                    'rgba(56, 189, 248, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(56, 189, 248, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // // 模拟实时数据更新
    // setInterval(function() {
    //     // 更新一些数字
    //     const randomValue = Math.floor(Math.random() * 3) + 1;
    //     const statCards = $('.stat-card .stat-value');
    //     const currentValue = parseInt(statCards.eq(0).text().replace(',', ''));
    //     statCards.eq(0).text(currentValue + randomValue);
    //
    //     // 添加动画效果
    //     statCards.eq(0).parent().addClass('bg-info');
    //     setTimeout(() => {
    //         statCards.eq(0).parent().removeClass('bg-info');
    //     }, 1000);
    // }, 5000);
});
