$(document).ready(function() {
    // Initialize DataTable
    var table = $('#data-table').DataTable();

    // Initialize vis-network graph
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
    var container = document.getElementById('visualization');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        edges: {
            arrows: 'to',
            color: '#FF5733' // Relationship color
        }
    };
    var network = new vis.Network(container, data, options);

    // Load initial graph data
    loadGraph();

    // Add Relationship
    $('#relationship-form').on('submit', function(event) {
        event.preventDefault();
        var entity1 = $('#entity1').val();
        var relationship = $('#relationship').val();
        var entity2 = $('#entity2').val();

        $.ajax({
            url: '/add_relationship',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ entity1: entity1, relationship: relationship, entity2: entity2 }),
            success: function(response) {
                if (response.success) {
                    alert('Relationship added successfully!');
                    addRelationshipToGraph(entity1, relationship, entity2);
                    table.row.add([
                        entity1,
                        relationship,
                        entity2,
                        '<button class="btn btn-warning btn-sm edit-btn">Edit</button>',
                        '<button class="btn btn-danger btn-sm delete-btn">Delete</button>'
                    ]).draw(false);
                } else {
                    alert('Error adding relationship: ' + response.error);
                }
            }
        });

        // Clear form fields
        $('#relationship-form')[0].reset();
    });

    // Upload CSV
    $('#upload-csv').on('click', function() {
        var file = $('#file-upload')[0].files[0];
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: '/upload_csv',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.success) {
                    alert('CSV uploaded successfully!');
                    loadGraph();
                } else {
                    alert('Error uploading CSV: ' + response.error);
                }
            }
        });
    });

    // Delete All
    $('#delete-graph').on('click', function() {
        $.ajax({
            url: '/delete_graph',
            method: 'POST',
            success: function(response) {
                if (response.success) {
                    alert('Graph deleted successfully!');
                    table.clear().draw();
                    nodes.clear();
                    edges.clear();
                } else {
                    alert('Error deleting graph: ' + response.error);
                }
            }
        });
    });

    // Query Search
    $('#query-form').on('submit', function(event) {
        event.preventDefault();
        var node = $('#query-node').val();

        $.ajax({
            url: '/query_node/' + node,
            method: 'GET',
            success: function(response) {
                var queryResults = $('#query-results');
                queryResults.html('');
                if (response.success) {
                    var resultsHtml = '<h4>Node: ' + response.node + '</h4>';
                    resultsHtml += '<ul>';
                    for (var neighbor in response.relationships) {
                        resultsHtml += '<li>' + response.node + ' ' + response.relationships[neighbor] + ' ' + neighbor + '</li>';
                    }
                    resultsHtml += '</ul>';
                    queryResults.html(resultsHtml);

                    // Clear existing graph and visualize only the queried node and its relationships
                    visualizeQueriedNode(response.node, response.relationships);
                } else {
                    queryResults.html('<p class="text-danger">' + response.error + '</p>');
                }
            }
        });
    });

    // Edit and Delete buttons
    $('#data-table tbody').on('click', 'button.edit-btn', function() {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        $('#entity1').val(data[0]);
        $('#relationship').val(data[1]);
        $('#entity2').val(data[2]);
        row.remove().draw(false);
    });

    $('#data-table tbody').on('click', 'button.delete-btn', function() {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        removeRelationshipFromGraph(data[0], data[1], data[2]);
        row.remove().draw(false);
    });

    function loadGraph() {
        $.ajax({
            url: '/load_graph',
            method: 'GET',
            success: function(response) {
                if (response.success) {
                    nodes.clear();
                    edges.clear();
                    table.clear().draw();
                    var graph = response.graph;
                    for (var node in graph) {
                        if (!nodes.get(node)) {
                            nodes.add({id: node, label: node, color: '#9370db'}); // Entity 1 color
                        }
                        for (var neighbor in graph[node]) {
                            if (!nodes.get(neighbor)) {
                                nodes.add({id: neighbor, label: neighbor, color: '#ff69b4'}); // Entity 2 color
                            }
                            edges.add({
                                from: node,
                                to: neighbor,
                                label: graph[node][neighbor],
                                color: {color: '#FF5733'} // Relationship color
                            });
                            table.row.add([
                                node,
                                graph[node][neighbor],
                                neighbor,
                                '<button class="btn btn-warning btn-sm edit-btn">Edit</button>',
                                '<button class="btn btn-danger btn-sm delete-btn">Delete</button>'
                            ]).draw(false);
                        }
                    }
                } else {
                    alert('Error loading graph: ' + response.error);
                }
            }
        });
    }

    function addRelationshipToGraph(entity1, relationship, entity2) {
        if (!nodes.get(entity1)) {
            nodes.add({id: entity1, label: entity1, color: '#9370db'}); // Entity 1 color
        }
        if (!nodes.get(entity2)) {
            nodes.add({id: entity2, label: entity2, color: '#ff69b4'}); // Entity 2 color
        }
        edges.add({from: entity1, to: entity2, label: relationship, color: {color: '#FF5733'}}); // Relationship color
    }

    function removeRelationshipFromGraph(entity1, relationship, entity2) {
        edges.remove(edges.get({
            filter: function(edge) {
                return edge.from === entity1 && edge.to === entity2 && edge.label === relationship;
            }
        }));
    }

    function visualizeQueriedNode(node, relationships) {
        nodes.clear();
        edges.clear();
        nodes.add({id: node, label: node, color: '#FFA500'}); // Entity 1 color
        for (var neighbor in relationships) {
            nodes.add({id: neighbor, label: neighbor, color: '#008080'}); // Entity 2 color
            edges.add({
                from: node,
                to: neighbor,
                label: relationships[neighbor],
                color: {color: '#FFFF00'} // Relationship color
            });
        }
    }
});
