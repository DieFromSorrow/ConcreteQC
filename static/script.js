// 虚拟数据
const projects = [
    {
        id: 1,
        name: "京沪高铁桥梁工程",
        constructionUnit: "中铁四局集团",
        buildingArea: "125,600",
        duration: "360",
        inspectionArea: "98,500",
        inspectionTime: "2023-06-15",
        totalPhotos: 2450,
        defectPhotos: 320,
        defectDistribution: [
            { type: "露筋", percentage: 45, color: "#FF6384" },
            { type: "缺棱掉角", percentage: 25, color: "#36A2EB" },
            { type: "夹渣", percentage: 15, color: "#FFA2AB" },
            { type: "裂渗", percentage: 8, color: "#4BC0C0" },
            { type: "连接缺陷", percentage: 7, color: "#9966FF" },
            { type: "孔洞类缺陷", percentage: 13, color: "#8296A8"}
        ],
        defects: [
            {
                id: 101,
                type: "露筋",
                count: 142,
                image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: [
                    { id: 1001, location: "桥墩", date: "2023-05-12", imageName: "defect-1001.jpg" },
                    { id: 1002, location: "梁板", date: "2023-05-18", imageName: "defect-1002.jpg" },
                    { id: 1003, location: "桥墩", date: "2023-06-02", imageName: "defect-1003.jpg" },
                    { id: 1004, location: "梁板", date: "2023-06-10", imageName: "defect-1004.jpg" },
                    { id: 1001, location: "桥墩", date: "2023-05-12", imageName: "defect-1001.jpg" },
                    { id: 1002, location: "梁板", date: "2023-05-18", imageName: "defect-1002.jpg" },
                    { id: 1003, location: "桥墩", date: "2023-06-02", imageName: "defect-1003.jpg" },
                    { id: 1004, location: "梁板", date: "2023-06-10", imageName: "defect-1004.jpg" }
                ]
            },
            {
                id: 102,
                type: "缺棱掉角",
                count: 78,
                image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: [
                    { id: 2001, location: "桥墩", date: "2023-05-20", imageName: "defect-2001.jpg" },
                    { id: 2002, location: "梁板", date: "2023-05-25", imageName: "defect-2002.jpg" }
                ]
            },
            {
                id: 103,
                type: "夹渣",
                count: 48,
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: [
                    { id: 3001, location: "桥墩", date: "2023-06-05", imageName: "defect-3001.jpg" },
                    { id: 3002, location: "梁板", date: "2023-06-08", imageName: "defect-3002.jpg" }
                ]
            },
            {
                id: 104,
                type: "裂渗",
                count: 25,
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: [
                    { id: 4001, location: "桥墩", date: "2023-05-30", imageName: "defect-4001.jpg" }
                ]
            },
            {
                id: 105,
                type: "连接缺陷",
                count: 27,
                image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: [
                    { id: 5001, location: "桥墩", date: "2023-06-12", imageName: "defect-5001.jpg" }
                ]
            },
            {
                id: 106,
                type: "孔洞类缺陷",
                count: 0,
                image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                records: []
            }
        ],
        highFrequencyAreas: [
            { area: "主桥墩", count: 65 },
            { area: "引桥", count: 52 },
            { area: "西侧桥面", count: 48 },
            { area: "东侧桥面", count: 42 },
            { area: "南桥塔", count: 35 },
            { area: "北桥塔", count: 28 },
            { area: "锚碇区", count: 10 }
        ]
    }
];

// 当前选中的项目和病害
let currentProjectId = 1;
let currentDefectId = 101;

// 全局变量
let currentCarouselInterval = null;
let currentHighlightedRecord = null;
let isCarouselRunning = true;

// 初始化页面
$(document).ready(function() {
    initProjectList();

    if (projects.length > 0) {
        loadProjectData(currentProjectId);
    }

    $('#toggleSidebar').click(function() {
        $('#project-sidebar').toggleClass('collapsed');
        $('#main-content').toggleClass('expanded');

        const icon = $(this).find('i');
        if ($('#project-sidebar').hasClass('collapsed')) {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        } else {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        }

        setTimeout(function() {
            if (window.defectDistributionChart) {
                window.defectDistributionChart.resize();
            }
            if (window.highFrequencyChart) {
                window.highFrequencyChart.resize();
            }
        }, 300);
    });
});

function initProjectList() {
    const projectList = $('#project-list');
    projectList.empty();

    projects.forEach(project => {
        const projectItem = $('<div>')
            .addClass('project-item')
            .attr('data-id', project.id)
            .html(`<i class="fas fa-building"></i> <span>${project.name}</span>`)
            .click(function() {
                $('.project-item').removeClass('active');
                $(this).addClass('active');
                currentProjectId = project.id;
                loadProjectData(project.id);
            });

        if (project.id === currentProjectId) {
            projectItem.addClass('active');
        }

        projectList.append(projectItem);
    });
}

function loadProjectData(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    $('#project-name').text(project.name);
    $('#construction-unit').text(project.constructionUnit);
    $('#building-area').text(project.buildingArea);
    $('#project-duration').text(project.duration);

    $('#inspection-area').text(project.inspectionArea);
    $('#inspection-time').text(project.inspectionTime);
    $('#total-photos').text(project.totalPhotos);
    $('#defect-photos').text(project.defectPhotos);

    updateDefectDistributionChart(project.defectDistribution);

    const allDefectTypes = project.defectDistribution.map(item => item.type);
    updateDefectTypesList(project.defects, allDefectTypes);

    updateHighFrequencyChart(project.highFrequencyAreas);

    if (project.defects.length > 0 && project.defects[0].count > 0) {
        loadDefectData(project.defects[0].id);
    } else {
        loadAllDefectRecords();
    }
}

function updateDefectDistributionChart(distribution) {
    const ctx = $('#defect-distribution-chart');
    const labels = distribution.map(item => item.type);
    const data = distribution.map(item => item.percentage);
    const colors = distribution.map(item => item.color);

    if (window.defectDistributionChart) {
        window.defectDistributionChart.destroy();
    }

    window.defectDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'rgba(15, 23, 42, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

function updateDefectTypesList(defects, allTypes) {
    const list = $('#defect-types-list');
    list.empty();

    const totalCount = defects.reduce((sum, defect) => sum + defect.count, 0);
    const allItem = $('<div>')
        .addClass('defect-type-item')
        .attr('data-id', 'all')
        .html(`
            <div>
                <i class="fas fa-circle-notch"></i> 全部
            </div>
            <div class="defect-count">${totalCount}</div>
        `)
        .click(function() {
            $('.defect-type-item').removeClass('active');
            $(this).addClass('active');
            loadAllDefectRecords();
        });
    list.append(allItem);

    allTypes.forEach(type => {
        const defect = defects.find(d => d.type === type);
        const count = defect ? defect.count : 0;

        const item = $('<div>')
            .addClass('defect-type-item')
            .attr('data-id', type)
            .html(`
                <div>
                    <i class="fas fa-circle-notch"></i> ${type}
                </div>
                <div class="defect-count">${count}</div>
            `)
            .click(function() {
                $('.defect-type-item').removeClass('active');
                $(this).addClass('active');
                if (defect) {
                    loadDefectData(defect.id);
                } else {
                    $('#defect-records-list').empty();
                    $('#defect-image').attr('src', '');
                }
            });

        if (defect && defect.id === currentDefectId) {
            item.addClass('active');
        }

        list.append(item);
    });
}

function loadDefectData(defectId) {
    currentDefectId = defectId;

    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const defect = project.defects.find(d => d.id === defectId);
    if (!defect) return;

    $('#defect-image').attr('src', defect.image);

    const records = defect.records.map(record => ({
        ...record,
        defectType: defect.type,
        imageUrl: defect.image
    }));

    updateDefectRecords(records);
}

function updateDefectRecords(records) {
    const list = $('#defect-records-list');
    list.empty();

    records.forEach(record => {
        const recordElement = $('<div>').addClass('record-item').html(`
            <div>${record.date}</div>
            <div>${record.location}</div>
            <div>${record.imageName}</div>
            <div>${record.defectType}</div>
        `).data('record', record)
         .click(function() {
             if ($(this).hasClass('active')) {
                 $(this).removeClass('active');
                 currentHighlightedRecord = null;
                 startCarousel();
                 isCarouselRunning = true;
             } else {
                 stopCarousel();
                 $('.record-item').removeClass('active');
                 $(this).addClass('active');
                 currentHighlightedRecord = record;
                 isCarouselRunning = false;
                 $('#defect-image').attr('src', record.imageUrl);
             }
         });

        list.append(recordElement);
    });

    startCarousel();
}

function startCarousel() {
    stopCarousel();

    const records = $('.record-item');
    if (records.length === 0) return;

    let currentIndex = 0;

    records.eq(currentIndex).addClass('active');
    $('#defect-image').attr('src', records.eq(currentIndex).data('record').imageUrl);

    currentCarouselInterval = setInterval(() => {
        records.removeClass('active');
        currentIndex = (currentIndex + 1) % records.length;
        records.eq(currentIndex).addClass('active');
        $('#defect-image').attr('src', records.eq(currentIndex).data('record').imageUrl);
    }, 3000);
}

function stopCarousel() {
    if (currentCarouselInterval) {
        clearInterval(currentCarouselInterval);
        currentCarouselInterval = null;
    }
}

function loadAllDefectRecords() {
    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    let allRecords = [];
    project.defects.forEach(defect => {
        defect.records.forEach(record => {
            allRecords.push({
                ...record,
                defectType: defect.type,
                imageUrl: defect.image,
                imageName: `${defect.type}-${record.id}.jpg`
            });
        });
    });

    updateDefectRecords(allRecords.slice(0, 5));
}

function updateHighFrequencyChart(areas) {
    const ctx = $('#high-frequency-chart');
    const labels = areas.map(item => item.area);
    const data = areas.map(item => item.count);
    const colors = areas.map((_, i) => {
        const colors = ['#FF6384', '#36A2EB', '#FFA2AB', '#4BC0C0', '#9966FF', '#8296A8', '#FF9F40'];
        return colors[i % colors.length];
    });

    if (window.highFrequencyChart) {
        window.highFrequencyChart.destroy();
    }

    window.highFrequencyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '病害数量',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.7', '1')),
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `病害数量: ${context.parsed.x}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(64, 158, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(64, 158, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 10,
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            }
        }
    });
}
