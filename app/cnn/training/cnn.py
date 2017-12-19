import tensorflow as tf

def cnn_model(x_train_data, label_size, keep_rate=0.7, training=True, seed=None):
    
    if seed is not None:
        tf.set_random_seed(seed)
    
    with tf.name_scope("layer_a"):
        # conv => 32*32*32
        conv1 = tf.layers.conv3d(inputs=x_train_data, filters=16, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv1", reuse=tf.AUTO_REUSE)
        # conv => 32*32*32
        conv2 = tf.layers.conv3d(inputs=conv1, filters=32, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv2", reuse=tf.AUTO_REUSE)
        # pool => 16*16*16
        pool3 = tf.layers.max_pooling3d(inputs=conv2, pool_size=[2, 2, 2], strides=2, name="pool3")
        
    with tf.name_scope("layer_b"):
        # conv => 16*16*16
        conv4 = tf.layers.conv3d(inputs=pool3, filters=64, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv4", reuse=tf.AUTO_REUSE)
        # conv => 16*16*16
        conv5 = tf.layers.conv3d(inputs=conv4, filters=128, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv5", reuse=tf.AUTO_REUSE)
        # pool => 8*8*8
        pool6 = tf.layers.max_pooling3d(inputs=conv5, pool_size=[2, 2, 2], strides=2, name="pool6")
        
    with tf.name_scope("layer_c"):
        # conv => 8*8*8
        conv7 = tf.layers.conv3d(inputs=pool6, filters=256, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv7", reuse=tf.AUTO_REUSE)
        # conv => 8*8*8
        conv8 = tf.layers.conv3d(inputs=conv7, filters=512, kernel_size=[3,3,3], padding='same', activation=tf.nn.relu, name="conv8", reuse=tf.AUTO_REUSE)
        # pool => 4*4*4
        pool9 = tf.layers.max_pooling3d(inputs=conv8, pool_size=[2, 2, 2], strides=2, name="pool9")
        
    with tf.name_scope("batch_norm"):
        cnn3d_bn = tf.layers.batch_normalization(inputs=pool9, training=training, name="bn", reuse=tf.AUTO_REUSE)
        
    with tf.name_scope("fully_con"):
        flattening = tf.reshape(cnn3d_bn, [-1, 4*4*4*512])
        dense = tf.layers.dense(inputs=flattening, units=1024, activation=tf.nn.relu, name="full_con", reuse=tf.AUTO_REUSE)
        # (1-keep_rate) is the probability that the node will be kept
        dropout = tf.layers.dropout(inputs=dense, rate=keep_rate, training=training, name="dropout")
        
    with tf.name_scope("y_conv"):
        y_conv = tf.layers.dense(inputs=dropout, units=label_size, name="y_pred", reuse=tf.AUTO_REUSE)
    
    return y_conv

def set_placeholders(x_shape, y_shape):
  
    with tf.name_scope('inputs'):
        x_input = tf.placeholder(tf.float32, shape=x_shape, name="x_input")
        y_input = tf.placeholder(tf.float32, shape=y_shape, name="y_input")
      
    return {'x_input': x_input, 'y_input': y_input}


def get_measurement(placeholders, seed=None, keep_rate=0.5, learning_rate=0.01, training=True, device='/cpu:0'):
    
    x_input = placeholders['x_input']
    y_input = placeholders['y_input']
    
    device_name = device
        
    with tf.device(device_name):
        
        prediction = cnn_model(x_input, y_input.shape[1].value, keep_rate, training=training, seed=seed)
        tf.add_to_collection("logits", prediction)
        
        with tf.name_scope("cross_entropy"):
            cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=prediction, labels=y_input), name="cross_entropy")
                              
        with tf.name_scope("training"):
            optimizer = tf.train.AdamOptimizer(learning_rate).minimize(cost)
            tf.add_to_collection("optimizer", optimizer)

        correct = tf.equal(tf.argmax(prediction, 1), tf.argmax(y_input, 1))
        accuracy = tf.reduce_mean(tf.cast(correct, 'float'), name="acc")    
    
    return {'prediction': prediction, 'cost': cost, 'optimizer': optimizer, 'accuracy': accuracy}


def run_nn(data, label, placeholders, measurments, session, summary_op=None, batch_size=32, epoch_step=0, training=True, device='/cpu:0'):
    
    x_input = placeholders['x_input']
    y_input = placeholders['y_input']
    
    prediction = measurments['prediction']
    cost = measurments['cost'] 
    optimizer = measurments['optimizer'] 
    accuracy = measurments['accuracy'] 
    
    iterations = int(len(data)/batch_size) + 1
    
    summary_step = 8
    summary_counter = int(epoch_step*(len(data)/summary_step))
    
    acc = 0
    with session.as_default():
        # mini batch
        for itr in range(iterations):
            mini_batch_x = data[itr*batch_size: (itr+1)*batch_size]
            mini_batch_y = label[itr*batch_size: (itr+1)*batch_size]
            
            if training and summary_op is None:
                _optimizer, _acc, _cost = session.run([optimizer, accuracy, cost], feed_dict={x_input: mini_batch_x, y_input: mini_batch_y})
                print('\tLost for', itr + 1, "/", iterations, _cost, end='\r')
                acc += _acc
                
            elif training and summary_op is not None:
                _optimizer, _acc, _cost, _summary = session.run([optimizer, accuracy, cost, summary_op['summary']], feed_dict={x_input: mini_batch_x, y_input: mini_batch_y})
                print('\tLost for', itr + 1, "/", iterations, _cost, end='\r')
                summary_op['train_writer'].add_summary(_summary, summary_counter)
                summary_op['train_writer'].flush()
                acc += _acc
                
            elif not training and summary_op is not None:
                _acc, _summary = session.run([accuracy, summary_op['summary']], feed_dict={x_input: mini_batch_x, y_input: mini_batch_y})
                print('\tAccuacy for', itr + 1, "/", iterations, _acc, end='\r')
                acc += _acc
                summary_op['test_writer'].add_summary(_summary, summary_counter)
                summary_op['test_writer'].flush()
                
            else:
                _acc = session.run(accuracy, feed_dict={x_input: mini_batch_x, y_input: mini_batch_y})
                print('\tAccuacy for', itr + 1, "/", iterations, _acc, end='\r')
                acc += _acc
            
            summary_counter += int(batch_size/summary_step)

        print("\n")
        
        if not training:
            print("\tTesting Accuracy:", acc/iterations)
        
        return acc/iterations
            

def train_neural_network(x_train_data, y_train_data, x_test_data, y_test_data,
                         placeholders, measurments, session, summary_op=None, epochs=10, 
                         batch_size=128, save_model=False, early_stop=None, model_name=None, 
                         device='/cpu:0'):

    import numbers
    import datetime

    if early_stop is not None:
        assert(isinstance(early_stop, numbers.Number)), "please give a number for early_stop, exp: 0.1 means the iteration will be stopped when the differences of two iteration is lower than 0.1"
    
    start_time = datetime.datetime.now()
    
    validation_accuracy = 0;

    # run epochs
    for epoch in range(epochs):
        start_time_epoch = datetime.datetime.now()
        print('Epoch', epoch, 'started')

        # train
        acc_train = run_nn(x_train_data, y_train_data, placeholders, measurments, summary_op=summary_op, session=session,
                           batch_size=batch_size, epoch_step=epoch, training=True, device=device)

         # test
        acc_test = run_nn(x_test_data, y_test_data, placeholders, measurments, summary_op=summary_op, session=session,
                          batch_size=batch_size, epoch_step=epoch, training=False, device=device)
        
        end_time_epoch = datetime.datetime.now()
        print('\tTime elapse:', str(end_time_epoch - start_time_epoch)) 

        if save_model:
            import os
            if model_name is not None:
                model_path = os.path.join(os.getcwd(), 'model', model_name)
            else:
                model_path = os.path.join(os.getcwd(), 'model', 'model')
            saver = tf.train.Saver()
            saver.save(sess, model_path, global_step=epoch)
        
        # Early stop
        if early_stop is not None:
            if acc_test - validation_accuracy > early_stop:
                validation_accuracy = acc_test
            else:
                break

    end_time = datetime.datetime.now()
    print('Time elapse: ', str(end_time - start_time))


