'use strict';

var cprocess = require('child_process'),
    log      = require('util').log,
    TaskManager;

TaskManager = function () {
    this.tasks = {};
}

TaskManager.prototype.addTask = function (taskId, command, options, callback) {
    if (typeof taskId  !== 'string') {
        throw new Error('Task id must be a valid string');
    }

    if (typeof command  !== 'string') {
        throw new Error('Command must be a valid string');
    }

    if (options && typeof options !== 'object') {
        throw new Error('Options must be a valid object');
    } 

    if (this.isTaskDefined(taskId)) {
        log('Task ' + taskId + 'allready defined. It will be overwritter');
    }

    log('Added task ' + taskId);

    this.tasks[taskId] = { command: command, options: options, callback: callback };
}

TaskManager.prototype.getTask = function (taskId) {
    return this.tasks[taskId];
}

TaskManager.prototype.isTaskDefined = function (taskId) {
    return !!this.tasks[taskId];
}

TaskManager.prototype.removeTask = function (taskId) {
    delete this.tasks[taskId];
}

TaskManager.prototype.executeTask = function (taskId) {
    if (this.isTaskDefined(taskId)) {
        var task = this.getTask(taskId);
        log('Executing task ' + taskId);
        task.process = cprocess.exec(task.command, task.options, task.callback);
        return task.process;
    } else {
        throw new Error('Task ' + taskId + ' is not defined');
    }
}

TaskManager.prototype.isRunning = function () {
    return true;
}

TaskManager.prototype.stopTask = function (taskId) {
    if (this.isTaskDefined(taskId)) {
        this.getTask(taskId).process.kill('SIGKILL');
    } else {
        throw new Error('Task ' + taskId + ' is not defined');
    }
}


module.exports = TaskManager;